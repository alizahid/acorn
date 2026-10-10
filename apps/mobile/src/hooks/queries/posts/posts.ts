import { type Comment, type Post, type Reddit } from '@acorn/reddit'
import { type InfiniteData, useInfiniteQuery } from '@tanstack/react-query'
import fuzzysort from 'fuzzysort'
import { uniqBy } from 'lodash'
import { create, type Draft } from 'mutative'
import { useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'

import {
  type FeedsQueryData,
  type FeedsQueryKey,
} from '~/hooks/queries/communities/feeds'
import { filterPosts } from '~/lib/filtering'
import { isComment } from '~/lib/guards'
import { queryClient } from '~/lib/query'
import { createApi } from '~/reddit/api'
import { useAuth } from '~/stores/auth'
import {
  type CommunityFeedSort,
  type FeedSort,
  type PostSort,
  type TopInterval,
  type UserFeedSort,
} from '~/types/sort'
import { type UserFeedType } from '~/types/user'

type Param = string | undefined | null

type Page = {
  cursor: Param
  posts: Array<Post | Comment>
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
  const { accountId } = useAuth(
    useShallow((state) => ({
      accountId: state.accountId,
    })),
  )

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery<Page, Error, PostsQueryData, PostsQueryKey, Param>({
    getNextPageParam(page) {
      return page.cursor
    },
    initialPageParam: null,
    async queryFn({ pageParam }) {
      const reddit = await createApi()

      const after = pageParam ?? undefined

      const time = sort === 'TOP' && interval ? interval : undefined

      if (user) {
        const input = {
          after,
          name: user,
          sort: sort as UserFeedSort,
          time,
        }

        if (userType === 'comments') {
          const { comments, cursor } = await reddit.comments.user(input)

          return {
            cursor,
            posts: comments,
          }
        }

        if (userType === 'saved') {
          return fetchSaved(reddit, pageParam)
        }

        const { cursor, posts } = await (userType === 'upvoted'
          ? reddit.feeds.upvoted({
              after,
            })
          : userType === 'downvoted'
            ? reddit.feeds.downvoted({
                after,
              })
            : userType === 'hidden'
              ? reddit.feeds.hidden({
                  after,
                })
              : reddit.feeds.user(input))

        return {
          cursor,
          posts: await filterPosts(posts, false),
        }
      }

      const input = {
        after,
        sort: sort as FeedSort | CommunityFeedSort,
        time,
      }

      const { cursor, posts } = await (community === 'all'
        ? reddit.feeds.all(input)
        : community === 'popular'
          ? reddit.feeds.popular(input)
          : community
            ? reddit.feeds.community({
                ...input,
                name: community,
              })
            : feed
              ? reddit.feeds.custom({
                  ...input,
                  path: getFeedPath(accountId, feed),
                })
              : reddit.feeds.home(input))

      return {
        cursor,
        posts: await filterPosts(
          posts,
          community ? community === 'all' || community === 'popular' : true,
        ),
      }
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
    const items = uniqBy(
      data?.pages.flatMap((page) => page.posts) ?? [],
      (item) => (isComment(item) ? item.data.id : item.id),
    )

    if (query?.length) {
      const results = fuzzysort.go(query, items, {
        keys: ['title', 'data.body'],
      })

      return results.map((result) => result.obj)
    }

    return items
  }, [data?.pages, query])

  return {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    posts,
    refetch,
  }
}

// Saved posts and saved comments page separately, so the page cursor holds
// both. ponytail: each page lists posts then comments, not interleaved by when
// they were saved (gql-fed doesn't send that)
async function fetchSaved(reddit: Reddit, param: Param): Promise<Page> {
  const cursors: Record<'comments' | 'posts', string | null | undefined> = param
    ? JSON.parse(param)
    : {}

  const [posts, comments] = await Promise.all([
    cursors.posts === null
      ? null
      : reddit.feeds.saved({
          after: cursors.posts,
        }),
    cursors.comments === null
      ? null
      : reddit.comments.saved({
          after: cursors.comments,
        }),
  ])

  const next = {
    comments: comments?.cursor ?? null,
    posts: posts?.cursor ?? null,
  }

  return {
    cursor: next.comments || next.posts ? JSON.stringify(next) : null,
    posts: [
      ...(await filterPosts(posts?.posts ?? [], false)),
      ...(comments?.comments ?? []),
    ],
  }
}

// Feeds are keyed by id across the app (defaults, sorting, links). The path
// comes from the user's feed list, since a followed feed belongs to someone
// else; a feed that isn't in it is assumed to be the user's own.
function getFeedPath(accountId: string | undefined, id: string) {
  const feeds = queryClient.getQueryData<FeedsQueryData>([
    'feeds',
    {
      accountId,
    },
  ] satisfies FeedsQueryKey)

  return (
    feeds?.find((item) => item.id === id)?.path ?? `/user/${accountId}/m/${id}/`
  )
}

export function updatePosts(
  id: string,
  updater?: (draft: Draft<Post | Comment>) => void,
  remove?: boolean,
) {
  const cache = queryClient.getQueryCache()

  const queries = cache.findAll({
    queryKey: ['posts', {}] satisfies PostsQueryKey,
  })

  for (const query of queries) {
    queryClient.setQueryData<PostsQueryData>(query.queryKey, (previous) => {
      if (!previous) {
        return previous
      }

      return create(previous, (draft) => {
        loop: for (const page of draft.pages) {
          for (const item of page.posts) {
            if ('id' in item ? item.id === id : item.data.id === id) {
              updater?.(item)

              if (remove) {
                const index = page.posts.findIndex(
                  (post) => ('id' in post ? post.id : post.data.id) === id,
                )

                page.posts.splice(index, 1)
              }

              break loop
            }
          }
        }
      })
    })
  }
}
