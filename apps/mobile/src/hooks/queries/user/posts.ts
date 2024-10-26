import {
  type InfiniteData,
  useInfiniteQuery,
  useIsRestoring,
} from '@tanstack/react-query'
import { compact } from 'lodash'
import { create } from 'mutative'

import { queryClient } from '~/lib/query'
import { reddit } from '~/reddit/api'
import { REDDIT_URI } from '~/reddit/config'
import { SavedPostsSchema } from '~/schemas/posts'
import { useAuth } from '~/stores/auth'
import { useHistory } from '~/stores/history'
import { usePreferences } from '~/stores/preferences'
import { transformComment } from '~/transformers/comment'
import { transformPost } from '~/transformers/post'
import { type CommentReply } from '~/types/comment'
import { type Post } from '~/types/post'
import { type TopInterval, type UserFeedSort } from '~/types/sort'
import { type UserFeedType } from '~/types/user'

type Param = string | undefined | null

type Page = {
  cursor: Param
  posts: Array<
    | {
        data: CommentReply
        type: 'comment'
      }
    | {
        data: Post
        type: 'post'
      }
  >
}

export type UserPostsQueryKey = [
  'posts',
  string,
  {
    accountId?: string
    interval?: TopInterval
    sort?: UserFeedSort
    type: UserFeedType
  },
]

export type UserPostsQueryData = InfiniteData<Page, Param>

export type UserPostsProps = {
  interval?: TopInterval
  sort: UserFeedSort
  type: UserFeedType
  username: string
}

export function useUserPosts({
  interval,
  sort,
  type,
  username,
}: UserPostsProps) {
  const { accountId } = useAuth()

  const { hideSeen } = usePreferences()
  const seen = useHistory((state) => state.posts)

  const isRestoring = useIsRestoring()

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery<
    Page,
    Error,
    UserPostsQueryData,
    UserPostsQueryKey,
    Param
  >({
    enabled: Boolean(accountId),
    initialPageParam: null,
    async queryFn({ pageParam }) {
      const url = new URL(`/user/${username}/${type}`, REDDIT_URI)

      url.searchParams.set('limit', '25')
      url.searchParams.set('sort', sort)

      if (sort === 'top' && interval) {
        url.searchParams.set('t', interval)
      }

      if (pageParam) {
        url.searchParams.set('after', pageParam)
      }

      const payload = await reddit({
        url,
      })

      const response = SavedPostsSchema.parse(payload)

      return {
        cursor: response.data.after,
        posts: compact(
          response.data.children.map((item) => {
            if (item.kind === 't1') {
              const comment = transformComment(item)

              if (comment.type === 'reply') {
                return {
                  data: comment.data,
                  type: 'comment',
                }
              }

              return null
            }

            if (hideSeen && seen.includes(item.data.id)) {
              return null
            }

            return {
              data: transformPost(item.data),
              type: 'post',
            }
          }),
        ),
      }
    },
    // eslint-disable-next-line sort-keys-fix/sort-keys-fix -- go away
    getNextPageParam(page) {
      return page.cursor
    },
    queryKey: [
      'posts',
      username,
      {
        accountId,
        interval,
        sort,
        type,
      },
    ],
  })

  return {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isRestoring || isLoading,
    posts: data?.pages.flatMap((page) => page.posts) ?? [],
    refetch,
  }
}

export function updateUserPost(
  id: string,
  updater: (draft: CommentReply | Post) => void,
) {
  const cache = queryClient.getQueryCache()

  const queries = cache.findAll({
    queryKey: ['posts'],
  })

  for (const query of queries) {
    if (typeof query.queryKey[1] !== 'string') {
      continue
    }

    queryClient.setQueryData<UserPostsQueryData>(query.queryKey, (previous) => {
      if (!previous) {
        return previous
      }

      return create(previous, (draft) => {
        let found = false

        for (const page of draft.pages) {
          if (found) {
            break
          }

          for (const post of page.posts) {
            if (post.data.id === id) {
              updater(post.data)

              found = true

              break
            }
          }
        }
      })
    })
  }
}
