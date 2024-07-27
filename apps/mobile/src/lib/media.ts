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
      Object.values(data.media_metadata).map((item) => {
        const video = 'hlsUrl' in item
        const gif = !video && 'gif' in item.s

        return [
          item.id,
          {
            height: video ? item.y : item.s.y,
            type: video ? 'video' : gif ? 'gif' : 'image',
            url: decode(
              video ? item.hlsUrl : 'gif' in item.s ? item.s.gif : item.s.u,
            ),
            width: video ? item.x : item.s.x,
          },
        ]
      }),
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
        const media = data.media_metadata?.[item.media_id]

        if (!media) {
          return
        }

        const video = 'hlsUrl' in media
        const gif = !video && 'gif' in media.s

        return {
          height: video ? media.y : media.s.y,
          type: video ? 'video' : gif ? 'gif' : 'image',
          url: decode(
            video ? media.hlsUrl : 'gif' in media.s ? media.s.gif : media.s.u,
          ),
          width: video ? media.x : media.s.x,
        }
      }),
    )
  }

  if (data.preview?.images) {
    return data.preview.images.map((image) => ({
      height: image.source.height,
      type: 'image',
      url: decode(image.source.url),
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
      type: 'video',
      url: decode(media.reddit_video.hls_url),
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
        type: 'video',
        url: redGifsLink[1],
        width: media.oembed.width,
      }
    }
  }
}

export type Dimensions = {
  height: number
  width: number
}

export function getDimensions(
  frameWidth: number,
  { height, width }: Dimensions,
) {
  return {
    height: (height / width) * frameWidth,
    width: frameWidth,
  }
}
