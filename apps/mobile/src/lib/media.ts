import { decode } from 'entities'
import { compact } from 'lodash'

import { type CommentDataSchema } from '~/schemas/reddit/comments'
import { type PostDataSchema } from '~/schemas/reddit/posts'
import { type PostMedia, type PostMediaMeta } from '~/types/post'

export function getMeta(
  data: PostDataSchema | CommentDataSchema,
): PostMediaMeta {
  if (data.media_metadata) {
    return Object.fromEntries(
      compact<[string, PostMedia]>(
        Object.values(data.media_metadata).map((item) => {
          if (item.status === 'failed') {
            return null
          }

          if ('hlsUrl' in item) {
            return [
              item.id,
              {
                height: item.y,
                type: 'video',
                url: decode(item.hlsUrl),
                width: item.x,
              },
            ]
          }

          return [
            item.id,
            {
              height: item.s.y,
              type: 'gif' in item.s ? 'gif' : 'image',
              url: decode('gif' in item.s ? item.s.gif : item.s.u),
              width: item.s.x,
            },
          ]
        }),
      ),
    )
  }

  return {}
}

export function getImages(data: PostDataSchema): Array<PostMedia> | undefined {
  if (data.media_metadata && data.gallery_data) {
    return compact(
      data.gallery_data.items.map((item) => {
        const media = data.media_metadata?.[item.media_id]

        if (!media || media.status === 'failed') {
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

export function getVideo(data: PostDataSchema): PostMedia | undefined {
  if (data.media && 'reddit_video' in data.media) {
    return {
      height: data.media.reddit_video.height,
      type: 'video',
      url: decode(data.media.reddit_video.hls_url),
      width: data.media.reddit_video.width,
    }
  }

  if (data.media && 'oembed' in data.media) {
    if (data.media.oembed.type === 'video') {
      if (data.media.type === 'redgifs.com') {
        const parts = /https:\/\/www\.redgifs\.com\/ifr\/(\w+)/.exec(
          data.media.oembed.html,
        )

        if (parts) {
          return {
            height: data.media.oembed.height,
            provider: 'redgifs',
            type: 'video',
            url: parts[1],
            width: data.media.oembed.width,
          }
        }
      }
    }
  }

  if (data.preview?.reddit_video_preview) {
    return {
      height: data.preview.reddit_video_preview.height,
      type: 'video',
      url: decode(data.preview.reddit_video_preview.hls_url),
      width: data.preview.reddit_video_preview.width,
    }
  }
}

export type Dimensions = {
  height: number
  width: number
}

export function getDimensions(
  maxWidth: number,
  { height, width }: Dimensions,
): Dimensions {
  return {
    height: (height / width) * maxWidth,
    width: maxWidth,
  }
}
