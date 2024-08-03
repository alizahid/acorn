import { useMutation, useQuery } from '@tanstack/react-query'
import { create } from 'mutative'
import { useMemo } from 'react'
import { MMKV } from 'react-native-mmkv'

import { queryClient } from '~/lib/query'
import { REDDIT_URI, redditApi } from '~/lib/reddit'
import { PostSchema } from '~/schemas/reddit/post'
import { useAuth } from '~/stores/auth'
import { transformComment } from '~/transformers/comment'
import { transformPost } from '~/transformers/post'
import { type Comment } from '~/types/comment'
import { type Post } from '~/types/post'

import { type PostsQueryData } from './posts'

const COLLAPSED_KEY = 'collapsed'

export type PostQueryKey = ['post', string]

export type PostQueryData = {
  comments: Array<Comment>
  post: Post
}

export function usePost(id: string) {
  const { accessToken, expired } = useAuth()

  const postQueryKey = ['post', id] satisfies PostQueryKey

  const query = useQuery<
    PostQueryData,
    Error,
    PostQueryData | undefined,
    PostQueryKey
  >({
    enabled: !expired,
    initialData() {
      return getPost(id)
    },
    async queryFn() {
      const url = new URL(`/comments/${String(id)}`, REDDIT_URI)

      url.searchParams.set('limit', '100')
      url.searchParams.set('threaded', 'false')

      const payload = await redditApi({
        accessToken,
        url,
      })

      const response = PostSchema.parse(payload)

      const post = response[0].data.children[0]
      const comments = response[1].data.children

      return {
        comments: comments.map((item) => transformComment(item)),
        post: transformPost(post.data),
      }
    },
    queryKey: postQueryKey,
    staleTime({ state }) {
      if (!state.data) {
        return 0
      }

      if (state.data.comments.length === 0 && state.data.post.comments > 0) {
        return 0
      }

      return Infinity
    },
  })

  const collapsedQueryKey = ['collapsed', id] as const

  const collapsed = useQuery({
    initialData: [],
    queryFn() {
      const store = new MMKV({
        id: `collapsed-${id}`,
      })

      const data = store.getString(COLLAPSED_KEY)

      if (data) {
        return data.split(',')
      }

      return []
    },
    queryKey: collapsedQueryKey,
  })

  const collapse = useMutation({
    // eslint-disable-next-line @typescript-eslint/require-await -- go away
    async mutationFn(commentId: string) {
      const previousComments =
        queryClient.getQueryData<PostQueryData>(postQueryKey)

      const ids = getCollapsible(previousComments?.comments ?? [], commentId)

      const previous =
        queryClient.getQueryData<Array<string>>(collapsedQueryKey) ?? []

      const next = create(previous, (draft) => {
        for (const itemId of ids) {
          const index = draft.indexOf(itemId)

          if (index >= 0) {
            draft.splice(index, 1)
          } else {
            draft.push(itemId)
          }
        }
      })

      queryClient.setQueryData<Array<string>>(collapsedQueryKey, () => next)

      const store = new MMKV({
        id: `collapsed-${id}`,
      })

      store.set(COLLAPSED_KEY, next.join(','))
    },
  })

  const comments = useMemo(() => {
    const items = query.data?.comments ?? []

    return items.filter((comment) =>
      comment.data.parentId
        ? !collapsed.data.includes(comment.data.parentId ?? comment.data.id)
        : true,
    )
  }, [collapsed.data, query.data?.comments])

  return {
    collapse: collapse.mutate,
    collapsed: collapsed.data,
    comments,
    isFetching: query.isFetching,
    isRefetching: query.isRefetching,
    post: query.data?.post,
    refetch: query.refetch,
  }
}

function getPost(id: string) {
  const cache = queryClient.getQueryCache()

  const queries = cache.findAll({
    queryKey: ['posts'],
  })

  for (const query of queries) {
    const data = query.state.data as PostsQueryData | undefined

    if (!data) {
      continue
    }

    for (const page of data.pages) {
      for (const post of page.posts) {
        if (post.id === id) {
          return {
            comments: [],
            post,
          }
        }
      }
    }
  }
}

export function getCollapsible(
  comments: Array<Comment>,
  id: string,
): Array<string> {
  const ids: Array<string> = [id]

  function findChildren(parentId: string) {
    const children = comments.filter((item) => item.data.parentId === parentId)

    for (const child of children) {
      ids.push(child.data.id)

      findChildren(child.data.id)
    }
  }

  findChildren(id)

  return ids
}
