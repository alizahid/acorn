import { type Comment, type Post } from '@acorn/reddit'
import { useMutation, useQuery } from '@tanstack/react-query'
import { eq } from 'drizzle-orm'
import { create, type Draft } from 'mutative'
import { useCallback, useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'

import { db } from '~/db'
import { isComment, isPost } from '~/lib/guards'
import { queryClient } from '~/lib/query'
import { addPrefix } from '~/lib/reddit'
import { createApi } from '~/reddit/api'
import { usePreferences } from '~/stores/preferences'
import { type Undefined } from '~/types'
import { type CommentSort } from '~/types/sort'

import { getPostFromSearch } from '../search/search'
import { type PostsQueryData, type PostsQueryKey, updatePosts } from './posts'

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

type CollapseVariables = {
  commentId: string
}

type Props = {
  commentId?: string
  id: string
  sort?: CommentSort
}

export function usePost({ commentId, id: postId, sort }: Props) {
  // links and routes carry bare ids
  const id = addPrefix(postId, 'link')

  const { collapseAutoModerator } = usePreferences(
    useShallow((state) => ({
      collapseAutoModerator: state.collapseAutoModerator,
    })),
  )

  const query = useQuery<
    Undefined<PostQueryData>,
    Error,
    PostQueryData,
    PostQueryKey
  >({
    placeholderData(previous) {
      if (previous) {
        return previous
      }

      return getPlaceholderPost(id)
    },
    async queryFn() {
      const reddit = await createApi()

      const [post, { comments, cursor }, collapsed] = await Promise.all([
        reddit.posts.get({
          id,
        }),
        reddit.comments.list({
          commentId: commentId ? addPrefix(commentId, 'comment') : undefined,
          postId: id,
          sort,
        }),
        db
          .select({
            id: db.schema.collapsed.commentId,
          })
          .from(db.schema.collapsed)
          .where(eq(db.schema.collapsed.postId, id)),
      ])

      if (!post) {
        throw new Error('Post not found')
      }

      for (const comment of comments) {
        if (comment.type === 'more') {
          continue
        }

        if (
          (collapseAutoModerator &&
            comment.type === 'reply' &&
            comment.data.user.name === 'AutoModerator') ||
          collapsed.some((item) => item.id === comment.data.id)
        ) {
          comment.data.collapsed = true
        }
      }

      if (cursor) {
        comments.push(createMore(id, cursor))
      }

      return {
        comments,
        post,
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

  const { mutate: collapse } = useMutation<unknown, Error, CollapseVariables>({
    async mutationFn(variables) {
      const [exists] = await db
        .select()
        .from(db.schema.collapsed)
        .where(eq(db.schema.collapsed.commentId, variables.commentId))

      if (exists) {
        await db
          .delete(db.schema.collapsed)
          .where(eq(db.schema.collapsed.commentId, variables.commentId))

        return
      }

      await db.insert(db.schema.collapsed).values({
        commentId: variables.commentId,
        postId: id,
      })
    },
    onMutate(variables) {
      updatePosts(variables.commentId, (draft) => {
        if (isComment(draft) && draft.type === 'reply') {
          draft.data.collapsed = !draft.data.collapsed
        }
      })

      updatePost(id, (draft) => {
        for (const comment of draft.comments) {
          // deleted comments collapse their replies too
          if (
            comment.type !== 'more' &&
            comment.data.id === variables.commentId
          ) {
            comment.data.collapsed = !comment.data.collapsed

            break
          }
        }
      })
    },
  })

  const collapseThread = useCallback(
    (variables: CollapseVariables) => {
      const comments = query.data?.comments ?? []

      const parentIds = getParentCommentIds(comments, variables.commentId)

      const $commentId = parentIds.at(-1) ?? variables.commentId

      collapse({
        commentId: $commentId,
      })

      const index = comments
        .filter((item) => !isHidden(comments, item.data.id))
        .findIndex((item) => item.data.id === $commentId)

      return index + 1
    },
    [collapse, query.data?.comments],
  )

  const comments = useMemo(() => {
    const items = query.data?.comments ?? []

    return items.filter((item) => !isHidden(items, item.data.id))
  }, [query.data?.comments])

  return {
    collapse,
    collapseThread,
    comments,
    isFetching: query.isFetching,
    post: query.data?.post,
    refetch: query.refetch,
  }
}

function getPlaceholderPost(id: string): Undefined<PostQueryData> {
  const cache = queryClient.getQueryCache()

  const queries = cache.findAll({
    queryKey: ['posts', {}] satisfies PostsQueryKey,
  })

  for (const query of queries) {
    const data = query.state.data as Undefined<PostsQueryData>

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

        if (isPost(post)) {
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
      }
    }
  }

  return getPostFromSearch(id)
}

export function updatePost(
  postId: string,
  updater: (draft: Draft<PostQueryData>) => void,
) {
  const id = addPrefix(postId, 'link')

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

function getParentCommentIds(
  comments: Array<Comment>,
  commentId: string,
): Array<string> {
  const comment = comments.find(
    (item) => item.type !== 'more' && item.data.id === commentId,
  )

  if (!comment?.data.parentId) {
    return []
  }

  return [
    comment.data.parentId,
    ...getParentCommentIds(comments, comment.data.parentId),
  ]
}

function isHidden(comments: Array<Comment>, commentId: string) {
  const comment = comments.find((item) => item.data.id === commentId)

  if (!comment?.data.parentId) {
    return false
  }

  const parent = comments.find((item) => item.data.id === comment.data.parentId)

  if (parent && parent.type !== 'more' && parent.data.collapsed) {
    return true
  }

  return isHidden(comments, comment.data.parentId)
}

// a "load more" stub for the next page of top-level comments
export function createMore(postId: string, cursor: string): Comment {
  return {
    data: {
      count: 0,
      cursor,
      depth: 0,
      id: cursor,
      parentId: postId,
      thread: false,
    },
    type: 'more',
  }
}
