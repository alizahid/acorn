import {
  type InfiniteData,
  useInfiniteQuery,
  useIsRestoring,
} from '@tanstack/react-query'
import fuzzysort from 'fuzzysort'
import { uniqBy } from 'lodash'
import { create, type Draft } from 'mutative'
import { useMemo } from 'react'

import { getHidden } from '~/lib/db/hidden'
import { getHistory } from '~/lib/db/history'
import { queryClient } from '~/lib/query'
import { removePrefix } from '~/lib/reddit'
import { reddit } from '~/reddit/api'
import { REDDIT_URI } from '~/reddit/config'
import { type PostDataSchema, PostsSchema } from '~/schemas/posts'
import { useAuth } from '~/stores/auth'
import { usePreferences } from '~/stores/preferences'
import { transformPost } from '~/transformers/post'
import { type Post } from '~/types/post'
import { type PostSort, type TopInterval } from '~/types/sort'
import { type UserFeedType } from '~/types/user'

import { type UserPostsQueryData } from '../user/posts'

type Param = string | undefined | null

type Page = {
  cursor: Param
  posts: Array<Post>
}

export type PostsQueryKey = [
  'posts',
  {
    accountId?: string
    community?: string
    feed?: string
    interval?: TopInterval
    sort?: PostSort
    user?: string
    userType?: UserFeedType
  },
]

export type PostsQueryData = InfiniteData<Page, Param>

export type PostsProps = {
  community?: string
  feed?: string
  interval?: TopInterval
  query?: string
  sort: PostSort
  user?: string
  userType?: UserFeedType
}

export function usePosts({
  community,
  feed,
  interval,
  query,
  sort,
  user,
  userType,
}: PostsProps) {
  const isRestoring = useIsRestoring()

  const { accountId } = useAuth()

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery<Page, Error, PostsQueryData, PostsQueryKey, Param>({
    enabled: Boolean(accountId),
    initialPageParam: null,
    async queryFn({ pageParam }) {
      if (!accountId) {
        throw new Error('accountId not found')
      }

      const path = user
        ? `/user/${user}/${userType ?? 'submitted'}`
        : feed
          ? `/user/${accountId}/m/${feed}/${sort}`
          : community
            ? `/r/${community}/${sort}`
            : `/${sort}`

      const url = new URL(path, REDDIT_URI)

      url.searchParams.set('limit', '100')
      url.searchParams.set('sr_detail', 'true')
      url.searchParams.set('type', 'links')

      if (sort === 'top' && interval) {
        url.searchParams.set('t', interval)
      }

      if (pageParam) {
        url.searchParams.set('after', pageParam)
      }

      const payload = await reddit({
        url,
      })

      const response = PostsSchema.parse(payload)

      return {
        cursor: response.data.after,
        posts: await filterPosts(
          response.data.children.map((post) => post.data),
        ),
      }
    },
    // eslint-disable-next-line sort-keys-fix/sort-keys-fix -- go away
    getNextPageParam(page) {
      return page.cursor
    },
    queryKey: [
      'posts',
      {
        accountId,
        community,
        feed,
        interval,
        sort,
        user,
        userType,
      },
    ],
  })

  const posts = useMemo(() => {
    const items = uniqBy(data?.pages.flatMap((page) => page.posts) ?? [], 'id')

    if (query?.length) {
      const results = fuzzysort.go(query, items, {
        key: 'title',
      })

      return results.map((result) => result.obj)
    }

    return items
  }, [data?.pages, query])

  return {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isRestoring || isLoading,
    posts,
    refetch,
  }
}

export async function filterPosts(
  posts: Array<PostDataSchema>,
): Promise<Array<Post>> {
  const { hideSeen } = usePreferences.getState()

  const seen = await getHistory(posts.map((item) => item.id))
  const hidden = await getHidden()

  return posts
    .filter((post) => {
      if (hideSeen && seen.includes(post.id)) {
        return false
      }

      if (
        post.subreddit_id &&
        hidden.communities.includes(removePrefix(post.subreddit_id))
      ) {
        return false
      }

      if (hidden.users.includes(removePrefix(post.author_fullname))) {
        return false
      }

      return true
    })
    .map((post) => transformPost(post, seen))
}

export function updatePosts(
  id: string,
  updater?: (draft: Draft<Post>) => void,
  remove?: boolean,
) {
  const cache = queryClient.getQueryCache()

  const queries = cache.findAll({
    queryKey: ['posts', {}] satisfies PostsQueryKey,
  })

  for (const query of queries) {
    queryClient.setQueryData<PostsQueryData | UserPostsQueryData>(
      query.queryKey,
      (previous) => {
        if (!previous) {
          return previous
        }

        return create(previous, (draft) => {
          let found = false

          for (const page of draft.pages) {
            if (found) {
              break
            }

            for (const item of page.posts) {
              if ('id' in item ? item.id === id : item.data.id === id) {
                if ('id' in item || item.type === 'post') {
                  updater?.('id' in item ? item : item.data)
                }

                if (remove) {
                  const index = page.posts.findIndex(
                    (post) => ('id' in post ? post.id : post.data.id) === id,
                  )

                  page.posts.splice(index, 1)
                }

                found = true

                break
              }
            }
          }
        })
      },
    )
  }
}
