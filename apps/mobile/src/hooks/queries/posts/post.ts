import { useMutation, useQuery } from '@tanstack/react-query'
import { create } from 'mutative'
import { useMemo } from 'react'

import { queryClient } from '~/lib/query'
import { removePrefix } from '~/lib/reddit'
import { Store } from '~/lib/store'
import { reddit } from '~/reddit/api'
import { REDDIT_URI } from '~/reddit/config'
import { PostSchema } from '~/schemas/post'
import { useAuth } from '~/stores/auth'
import { transformComment } from '~/transformers/comment'
import { transformPost } from '~/transformers/post'
import { type Comment } from '~/types/comment'
import { type Post } from '~/types/post'
import { type CommentSort } from '~/types/sort'

import { type PostsQueryData } from './posts'

const COLLAPSED_KEY = 'collapsed'

export type PostQueryKey = [
  'post',
  {
    commentId?: string
    id: string
    sort?: CommentSort
  },
]

export type PostQueryData = {
  comments: Array<Comment>
  post: Post
}

type Props = {
  commentId?: string
  id: string
  sort?: CommentSort
}

export function usePost({ commentId, id, sort }: Props) {
  const { accountId } = useAuth()

  const storeId = `collapsed-${id}`

  const query = useQuery<
    PostQueryData | undefined,
    Error,
    PostQueryData,
    PostQueryKey
  >({
    enabled: Boolean(accountId),
    placeholderData(previous) {
      if (previous) {
        return previous
      }

      return getPost(id)
    },
    async queryFn() {
      const url = new URL(`/comments/${id}`, REDDIT_URI)

      url.searchParams.set('limit', '100')
      url.searchParams.set('threaded', 'false')

      if (commentId) {
        url.searchParams.set('comment', removePrefix(commentId))
      }

      if (sort) {
        url.searchParams.set('sort', sort)
      }

      const payload = await reddit({
        url,
      })

      const response = PostSchema.parse(payload)

      const post = response[0].data.children[0]
      const comments = response[1].data.children

      if (!post) {
        throw new Error('Post not found')
      }

      return {
        comments: comments.map((item) => transformComment(item)),
        post: transformPost(post.data),
      }
    },
    queryKey: [
      'post',
      {
        commentId,
        id,
        sort,
      },
    ],
  })

  const collapsedQueryKey = ['collapsed', id] as const

  const collapsed = useQuery({
    initialData: [],
    queryFn() {
      const store = new Store(storeId)

      const data = store.getItem<string>(COLLAPSED_KEY)

      if (data) {
        return data.split(',')
      }

      return []
    },
    queryKey: collapsedQueryKey,
  })

  const collapse = useMutation<
    unknown,
    Error,
    {
      commentId: string
      hide: boolean
    }
  >({
    // eslint-disable-next-line @typescript-eslint/require-await -- go away
    async mutationFn(variables) {
      const comments =
        queryClient.getQueryData<PostQueryData>([
          'post',
          {
            id,
            sort,
          },
        ])?.comments ?? []

      const ids = getCollapsible(comments, variables.commentId)

      const previous =
        queryClient.getQueryData<Array<string>>(collapsedQueryKey) ?? []

      const next = create(previous, (draft) => {
        for (const itemId of ids) {
          const index = draft.indexOf(itemId)

          if (variables.hide) {
            draft.push(itemId)
          } else {
            draft.splice(index, 1)
          }
        }
      })

      queryClient.setQueryData<Array<string>>(collapsedQueryKey, next)

      const store = new Store(storeId)

      store.setItem(COLLAPSED_KEY, next.join(','))
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

function getCollapsible(comments: Array<Comment>, id: string): Array<string> {
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

export function updatePost(
  id: string,
  updater: (draft: PostQueryData) => void,
) {
  const cache = queryClient.getQueryCache()

  const queries = cache.findAll({
    queryKey: [
      'post',
      {
        id,
      },
    ],
  })

  for (const query of queries) {
    queryClient.setQueryData<PostQueryData>(query.queryKey, (previous) => {
      if (!previous) {
        return previous
      }

      return create(previous, (draft) => {
        updater(draft)
      })
    })
  }
}
