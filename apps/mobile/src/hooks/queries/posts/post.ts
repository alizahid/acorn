import { useIsRestoring, useMutation, useQuery } from '@tanstack/react-query'
import { create, type Draft } from 'mutative'
import { useMemo } from 'react'

import { collapseComment, getCollapsedForPost } from '~/lib/db/collapsed'
import { queryClient } from '~/lib/query'
import { removePrefix } from '~/lib/reddit'
import { reddit } from '~/reddit/api'
import { REDDIT_URI } from '~/reddit/config'
import { PostSchema } from '~/schemas/post'
import { useAuth } from '~/stores/auth'
import { usePreferences } from '~/stores/preferences'
import { transformComment } from '~/transformers/comment'
import { transformPost } from '~/transformers/post'
import { type Comment } from '~/types/comment'
import { type Post } from '~/types/post'
import { type CommentSort } from '~/types/sort'

import { getPostFromSearch } from '../search/search'
import { type UserPostsQueryData } from '../user/posts'
import { type PostsQueryData, type PostsQueryKey } from './posts'

export type PostQueryKey = [
  'post',
  {
    collapseAutoModerator?: boolean
    commentId?: string
    id: string
    sort?: CommentSort
  },
]

export type PostQueryData = {
  comments: Array<Comment>
  post: Post
}

type CollapsedQueryKey = [
  'collapsed',
  {
    id: string
  },
]

type CollapsedData = Array<string>

type CollapseVariables = {
  commentId: string
}

type Props = {
  commentId?: string
  id: string
  sort?: CommentSort
}

export function usePost({ commentId, id, sort }: Props) {
  const isRestoring = useIsRestoring()

  const { accountId } = useAuth()
  const { collapseAutoModerator } = usePreferences()

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
      url.searchParams.set('sr_detail', 'true')

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

      const items = comments.map((item) => transformComment(item))

      if (collapseAutoModerator) {
        await Promise.all(
          items
            .filter(
              (item) =>
                item.type === 'reply' &&
                item.data.user.name === 'AutoModerator',
            )
            .map((item) =>
              collapse.mutateAsync({
                commentId: item.data.id,
              }),
            ),
        )
      }

      return {
        comments: items,
        post: transformPost(post.data, []),
      }
    },
    queryKey: [
      'post',
      {
        collapseAutoModerator,
        commentId,
        id,
        sort,
      },
    ],
  })

  const collapsedQueryKey: CollapsedQueryKey = [
    'collapsed',
    {
      id,
    },
  ]

  const collapsed = useQuery<
    CollapsedData,
    Error,
    CollapsedData,
    CollapsedQueryKey
  >({
    placeholderData: [],
    queryFn() {
      return getCollapsedForPost(id)
    },
    queryKey: collapsedQueryKey,
  })

  const collapse = useMutation<unknown, Error, CollapseVariables>({
    async mutationFn(variables) {
      await collapseComment(variables.commentId, id)
    },
    onMutate(variables) {
      queryClient.setQueryData<CollapsedData>(collapsedQueryKey, (previous) => {
        if (!previous) {
          return previous
        }

        return create(previous, (draft) => {
          const index = draft.indexOf(variables.commentId)

          if (index >= 0) {
            draft.splice(index, 1)
          } else {
            draft.push(variables.commentId)
          }
        })
      })
    },
  })

  const comments = useMemo(() => {
    const items = query.data?.comments ?? []

    return items.filter(
      (item) => !isHidden(items, collapsed.data ?? [], item.data.id),
    )
  }, [collapsed.data, query.data?.comments])

  return {
    collapse: collapse.mutate,
    collapsed: collapsed.data ?? [],
    comments,
    isFetching: isRestoring || query.isFetching || collapsed.isFetching,
    isRefreshing:
      query.isStale &&
      query.isFetching &&
      !query.isLoading &&
      !query.isPlaceholderData,
    post: query.data?.post,
    refetch: query.refetch,
  }
}

function getPost(id: string): PostQueryData | undefined {
  const cache = queryClient.getQueryCache()

  const queries = cache.findAll({
    queryKey: ['posts', {}] satisfies PostsQueryKey,
  })

  for (const query of queries) {
    const data = query.state.data as
      | PostsQueryData
      | UserPostsQueryData
      | undefined

    if (!data) {
      continue
    }

    for (const page of data.pages) {
      for (const post of page.posts) {
        if ('id' in post) {
          if (post.id === id) {
            return {
              comments: [],
              post,
            }
          }

          if (post.crossPost?.id === id) {
            return {
              comments: [],
              post: post.crossPost,
            }
          }
        }

        if (post.type === 'post') {
          if (post.data.id === id) {
            return {
              comments: [],
              post: post.data,
            }
          }

          if (post.data.crossPost?.id === id) {
            return {
              comments: [],
              post: post.data.crossPost,
            }
          }
        }
      }
    }
  }

  return getPostFromSearch(id)
}

export function updatePost(
  id: string,
  updater: (draft: Draft<PostQueryData>) => void,
) {
  const cache = queryClient.getQueryCache()

  const queries = cache.findAll({
    queryKey: [
      'post',
      {
        id,
      },
    ] satisfies PostQueryKey,
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

function isHidden(
  comments: Array<Comment>,
  collapsed: CollapsedData,
  commentId: string,
) {
  const comment = comments.find((item) => item.data.id === commentId)

  if (!comment?.data.parentId) {
    return false
  }

  if (collapsed.includes(comment.data.parentId)) {
    return true
  }

  return isHidden(comments, collapsed, comment.data.parentId)
}
