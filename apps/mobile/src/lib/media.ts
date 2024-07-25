import { decode } from 'entities'
import { compact } from 'lodash'

import { type PostsSchema } from '~/schemas/reddit/posts'
import {
  type PostImage,
  type PostMediaMeta,
  type PostVideo,
} from '~/types/post'

export function getMeta(
  data: PostsSchema['data']['children'][number]['data'],
): PostMediaMeta {
  if (data.media_metadata) {
    return Object.fromEntries(
      Object.values(data.media_metadata).map((item) => [
        item.id,
        {
          height: item.s.y,
          url: getImageUrl(item.s.u),
          width: item.s.x,
        },
      ]),
    )
  }

  return {}
}

export function getImages(
  data: PostsSchema['data']['children'][number]['data'],
): Array<PostImage> | undefined {
  if (data.media_metadata && data.gallery_data) {
    return compact(
      data.gallery_data.items.map((item) => {
        const media = data.media_metadata?.[item.media_id].s

        if (!media) {
          return
        }

        return {
          height: media.y,
          url: getImageUrl(media.u),
          width: media.x,
        }
      }),
    )
  }

  if (data.preview?.images) {
    return data.preview.images.map((image) => ({
      height: image.source.height,
      url: getImageUrl(image.source.url),
      width: image.source.width,
    }))
  }
}

export function getVideo(
  media: PostsSchema['data']['children'][number]['data']['media'],
): PostVideo | undefined {
  if (!media) {
    return
  }

  if ('reddit_video' in media) {
    return {
      height: media.reddit_video.height,
      provider: 'reddit',
      url: media.reddit_video.fallback_url,
      width: media.reddit_video.width,
    }
  }

  if ('oembed' in media) {
    const redGifsLink = /https:\/\/www\.redgifs\.com\/ifr\/(\w+)/.exec(
      media.oembed.html,
    )

    if (redGifsLink) {
      return {
        height: media.oembed.height,
        provider: 'redgifs',
        url: redGifsLink[1],
        width: media.oembed.width,
      }
    }
  }
}

export function getDimensions(
  frameWidth: number,
  {
    height,
    width,
  }: {
    height: number
    width: number
  },
) {
  const ratio = height / width

  return frameWidth * ratio
}

export function getImageUrl(url: string) {
  return decode(url)
}
