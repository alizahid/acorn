import { useIsRestoring, useMutation, useQuery } from '@tanstack/react-query'
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

import { getPostFromSearch } from '../search/search'
import { type UserPostsQueryData } from '../user/posts'
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
  const isRestoring = useIsRestoring()

  const { accountId } = useAuth()

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

  const storeId = `collapsed-${id}`

  const queryKey = ['collapsed', id] as const

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
    queryKey,
  })

  const collapse = useMutation<
    unknown,
    Error,
    {
      commentId: string
    }
  >({
    // eslint-disable-next-line @typescript-eslint/require-await -- go away
    async mutationFn(variables) {
      const previous = queryClient.getQueryData<Array<string>>(queryKey) ?? []

      const next = create(previous, (draft) => {
        const index = draft.indexOf(variables.commentId)

        if (index >= 0) {
          draft.splice(index, 1)
        } else {
          draft.push(variables.commentId)
        }
      })

      queryClient.setQueryData<Array<string>>(queryKey, next)

      const store = new Store(storeId)

      store.setItem(COLLAPSED_KEY, next.join(','))
    },
  })

  const comments = useMemo(() => {
    const items = query.data?.comments ?? []

    return items.filter(
      (item) => !isHidden(items, collapsed.data, item.data.id),
    )
  }, [collapsed.data, query.data?.comments])

  return {
    collapse: collapse.mutate,
    collapsed: collapsed.data,
    comments,
    isFetching: isRestoring || query.isFetching,
    post: query.data?.post,
    refetch: query.refetch,
  }
}

function getPost(id: string): PostQueryData | undefined {
  const cache = queryClient.getQueryCache()

  const queries = cache.findAll({
    queryKey: ['posts'],
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

function isHidden(
  comments: Array<Comment>,
  collapsed: Array<string>,
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
