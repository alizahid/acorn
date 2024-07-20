import { type InfiniteData, useInfiniteQuery } from '@tanstack/react-query'
import { compact } from 'lodash'
import { useEffect } from 'react'
import { type z } from 'zod'

import { getImageUrl, getVideo } from '~/lib/media'
import { redditApi } from '~/lib/reddit'
import { ListingsSchema } from '~/schemas/reddit/listings'
import { useAuth } from '~/stores/auth'
import { type Post } from '~/types/post'

type Page = z.infer<typeof ListingsSchema> | null

type Params = {
  after: string | null
  before: string | null
}

export function useFeed<Type extends 'new' | 'best' | 'top' | 'rising' | 'hot'>(
  type: Type,
) {
  const { accessToken, expired, refresh } = useAuth()

  useEffect(() => {
    if (expired) {
      void refresh()
    }
  }, [expired, refresh])

  const { data } = useInfiniteQuery<
    Page,
    Error,
    InfiniteData<Page>,
    ['feed', Type],
    Params
  >({
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
      const url = new URL(`/${type}`, 'https://oauth.reddit.com')

      url.searchParams.set('g', 'GLOBAL')
      url.searchParams.set('limit', '25')

      if (pageParam.before) {
        url.searchParams.set('before', pageParam.before)
      } else if (pageParam.after) {
        url.searchParams.set('after', pageParam.after)
      }

      const payload = await redditApi(url, accessToken)

      return ListingsSchema.parse(payload)
    },
    queryKey: ['feed', type],
  })

  return {
    posts: compact(data?.pages.flatMap((page) => page?.data.children)).map(
      (post) =>
        ({
          comments: post.data.num_comments,
          createdAt: new Date(post.data.created),
          id: post.data.id,
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
          text: post.data.selftext || undefined,
          title: post.data.title,
          user: {
            id: post.data.author,
            name: post.data.author_fullname,
          },
          votes: post.data.ups,
        }) satisfies Post,
    ),
  }
}
