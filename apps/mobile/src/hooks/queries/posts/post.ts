import { useMutation, useQuery } from '@tanstack/react-query'
import { compact } from 'lodash'
import { create, type Draft } from 'mutative'
import { useMemo } from 'react'

import { collapseComment, getCollapsedForPost } from '~/lib/db/collapsed'
import { isComment, isPost } from '~/lib/guards'
import { queryClient } from '~/lib/query'
import { removePrefix } from '~/lib/reddit'
import { reddit } from '~/reddit/api'
import { REDDIT_URI } from '~/reddit/config'
import { fetchUserData } from '~/reddit/users'
import { PostSchema } from '~/schemas/post'
import { useAuth } from '~/stores/auth'
import { usePreferences } from '~/stores/preferences'
import { transformComment } from '~/transformers/comment'
import { transformPost } from '~/transformers/post'
import { type Comment } from '~/types/comment'
import { type Post } from '~/types/post'
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
  force?: boolean
}

type Props = {
  commentId?: string
  id: string
  sort?: CommentSort
}

export function usePost({ commentId, id, sort }: Props) {
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

      const users = await fetchUserData(
        post.data.author_fullname,
        ...compact(
          response[1].data.children
            .filter((item) => item.kind === 't1')
            .map((item) => item.data.author_fullname),
        ),
      )

      const collapsed = await getCollapsedForPost(id)

      return {
        comments: comments.map((item) =>
          transformComment(item, users, {
            collapseAutoModerator,
            collapsed,
          }),
        ),
        post: transformPost(post.data, [], users),
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

  const collapse = useMutation<unknown, Error, CollapseVariables>({
    async mutationFn(variables) {
      await collapseComment(variables.commentId, id, variables.force)
    },
    onMutate(variables) {
      updatePosts(variables.commentId, (draft) => {
        if (isComment(draft) && draft.type === 'reply') {
          draft.data.collapsed = !draft.data.collapsed
        }
      })

      updatePost(id, (draft) => {
        for (const comment of draft.comments) {
          if (
            comment.type === 'reply' &&
            comment.data.id === variables.commentId
          ) {
            comment.data.collapsed = !comment.data.collapsed

            break
          }
        }
      })
    },
  })

  const comments = useMemo(() => {
    const items = query.data?.comments ?? []

    return items.filter((item) => !isHidden(items, item.data.id))
  }, [query.data?.comments])

  return {
    collapse: collapse.mutate,
    comments,
    isFetching: query.isFetching,
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
    const data = query.state.data as PostsQueryData | undefined

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

function isHidden(comments: Array<Comment>, commentId: string) {
  const comment = comments.find((item) => item.data.id === commentId)

  if (!comment?.data.parentId) {
    return false
  }

  const parent = comments.find((item) => item.data.id === comment.data.parentId)

  if (parent?.type === 'reply' && parent.data.collapsed) {
    return true
  }

  return isHidden(comments, comment.data.parentId)
}
