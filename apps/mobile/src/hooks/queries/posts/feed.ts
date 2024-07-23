import { type InfiniteData, useInfiniteQuery } from '@tanstack/react-query'
import { decode } from 'entities'
import { compact } from 'lodash'
import { useMemo } from 'react'
import { type z } from 'zod'

import { REDDIT_URI } from '~/lib/const'
import { getImageUrl, getVideo } from '~/lib/media'
import { redditApi } from '~/lib/reddit'
import { ListingsSchema } from '~/schemas/reddit/listings'
import { useAuth } from '~/stores/auth'
import { type Post } from '~/types/post'

export const FeedType = ['new', 'best', 'top', 'rising', 'hot'] as const

export type FeedType = (typeof FeedType)[number]

type Page = z.infer<typeof ListingsSchema> | null

export type FeedQuery = InfiniteData<Page>

type Params = {
  after: string | null
  before: string | null
}

export function useFeed(type: FeedType) {
  const { accessToken, expired } = useAuth()

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    isRefetching,
    refetch,
  } = useInfiniteQuery<Page, Error, FeedQuery, ['feed', FeedType], Params>({
    enabled: !expired,
    getNextPageParam(page) {
      return {
        after: page?.data.after ?? null,
        before: page?.data.before ?? null,
      }
    },
    initialPageParam: {
      after: null,
      before: null,
    },
    async queryFn({ pageParam }) {
      const url = new URL(`/${type}`, REDDIT_URI)

      url.searchParams.set('g', 'GLOBAL')
      url.searchParams.set('limit', '25')

      if (pageParam.before) {
        url.searchParams.set('before', pageParam.before)
      } else if (pageParam.after) {
        url.searchParams.set('after', pageParam.after)
      }

      const payload = await redditApi({
        accessToken,
        url,
      })

      return ListingsSchema.parse(payload)
    },
    queryKey: ['feed', type],
  })

  const posts = useMemo(
    () =>
      compact(data?.pages.flatMap((page) => page?.data.children)).map(
        (post) =>
          ({
            comments: post.data.num_comments,
            content: decode(post.data.selftext.trim()) || undefined,
            createdAt: new Date(post.data.created * 1_000),
            id: post.data.id,
            liked: post.data.likes,
            media: {
              images: post.data.preview?.images.map((image) => ({
                height: image.source.height,
                url: getImageUrl(image.source.url),
                width: image.source.width,
              })),
              video: getVideo(post.data.media),
            },
            permalink: post.data.permalink,
            read: post.data.clicked,
            saved: post.data.saved,
            spoiler: post.data.spoiler,
            subreddit: post.data.subreddit,
            title: decode(post.data.title.trim()),
            user: {
              id: post.data.author,
              name: post.data.author_fullname,
            },
            votes: post.data.ups,
          }) satisfies Post,
      ),
    [data?.pages],
  )

  return {
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    isRefetching,
    posts,
    refetch,
  }
}
