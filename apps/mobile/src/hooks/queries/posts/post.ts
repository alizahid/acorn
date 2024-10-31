import {
  type QueryKey,
  useIsRestoring,
  useMutation,
  useQuery,
} from '@tanstack/react-query'
import { formatISO } from 'date-fns'
import { create } from 'mutative'
import { useMemo } from 'react'

import { getDatabase } from '~/lib/db'
import { queryClient } from '~/lib/query'
import { removePrefix } from '~/lib/reddit'
import { reddit } from '~/reddit/api'
import { REDDIT_URI } from '~/reddit/config'
import { PostSchema } from '~/schemas/post'
import { useAuth } from '~/stores/auth'
import { transformComment } from '~/transformers/comment'
import { transformPost } from '~/transformers/post'
import { type Comment } from '~/types/comment'
import { type CollapsedRow } from '~/types/db'
import { type Post } from '~/types/post'
import { type CommentSort } from '~/types/sort'

import { getPostFromSearch } from '../search/search'
import { type UserPostsQueryData } from '../user/posts'
import { type PostsQueryData } from './posts'

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

      return {
        comments: comments.map((item) => transformComment(item)),
        post: transformPost(post.data, []),
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

  const queryKey: QueryKey = [
    'collapsed',
    {
      id,
    },
  ]

  const collapsed = useQuery<CollapsedData>({
    placeholderData: [],
    async queryFn() {
      const db = await getDatabase()

      const rows = await db.getAllAsync<Pick<CollapsedRow, 'comment_id'>>(
        `SELECT comment_id FROM collapsed WHERE post_id = $post`,
        {
          $post: id,
        },
      )

      return rows.map((row) => row.comment_id)
    },
    queryKey,
  })

  const collapse = useMutation<unknown, Error, CollapseVariables>({
    async mutationFn(variables) {
      const db = await getDatabase()

      const exists = await db.getFirstAsync<Pick<CollapsedRow, 'comment_id'>>(
        'SELECT comment_id FROM collapsed WHERE comment_id = $comment AND post_id = $post LIMIT 1',
      )

      if (exists) {
        await db.runAsync(
          'DELETE FROM collapsed WHERE comment_id = $comment AND post_id = $post LIMIT 1',
          {
            $comment: variables.commentId,
            $post: id,
          },
        )
      } else {
        await db.runAsync(
          'INSERT INTO collapsed (comment_id, post_id, collapsed_at) VALUES ($comment, $post, $time) ON CONFLICT (comment_id) DO NOTHING',
          {
            $comment: variables.commentId,
            $post: id,
            $time: formatISO(new Date()),
          },
        )
      }
    },
    onMutate(variables) {
      const previous = queryClient.getQueryData<CollapsedData>(queryKey) ?? []

      const next = create(previous, (draft) => {
        const index = draft.indexOf(variables.commentId)

        if (index >= 0) {
          draft.splice(index, 1)
        } else {
          draft.push(variables.commentId)
        }
      })

      queryClient.setQueryData<CollapsedData>(queryKey, next)
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
    collapsed: collapsed.data,
    comments,
    isFetching: isRestoring || query.isFetching || collapsed.isFetching,
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
