import { decode } from 'entities'
import { compact, maxBy } from 'lodash'

import { type CommentDataSchema } from '~/schemas/comments'
import { type PostDataSchema } from '~/schemas/posts'
import { type PostMedia, type PostMediaMeta } from '~/types/post'

export function getMeta(
  data: PostDataSchema | CommentDataSchema,
): PostMediaMeta {
  if (data.media_metadata) {
    return Object.fromEntries(
      compact<[string, PostMedia]>(
        Object.values(data.media_metadata).map((item) => {
          if (item.status !== 'valid') {
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

        if (!media || media.status !== 'valid') {
          return
        }

        const video = 'hlsUrl' in media
        const gif = !video && 'gif' in media.s

        const thumbnail = 'p' in media ? maxBy(media.p, 'x')?.u : undefined

        return {
          height: video ? media.y : media.s.y,
          thumbnail: thumbnail ? decode(thumbnail) : undefined,
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
    return data.preview.images.map((image) => {
      const item = image.variants?.gif ?? image

      const thumbnail = maxBy(item.resolutions, 'width')?.url

      return {
        height: item.source.height,
        thumbnail: thumbnail ? decode(thumbnail) : undefined,
        type: image.variants?.gif ? 'gif' : 'image',
        url: decode(item.source.url),
        width: item.source.width,
      }
    })
  }
}

export function getVideo(data: PostDataSchema): PostMedia | undefined {
  if (data.media && 'oembed' in data.media && 'type' in data.media.oembed) {
    if (data.media.oembed.type === 'video') {
      if (data.media.type.endsWith('redgifs.com')) {
        const parts = /https:\/\/www\.redgifs\.com\/ifr\/(\w+)/.exec(
          data.media.oembed.html,
        )

        if (parts?.[1]) {
          return {
            height: data.media.oembed.height,
            provider: 'red-gifs',
            type: 'video',
            url: parts[1],
            width: data.media.oembed.width,
          }
        }
      }

      if (data.url) {
        return {
          height: data.media.oembed.height,
          thumbnail: data.media.oembed.thumbnail_url ?? undefined,
          type: 'image',
          url: data.url,
          width: data.media.oembed.width,
        }
      }
    }
  }

  if (data.media && 'reddit_video' in data.media) {
    const url = new URL(decode(data.media.reddit_video.hls_url))

    url.searchParams.delete('a')

    return {
      height: data.media.reddit_video.height,
      provider: 'reddit',
      thumbnail: data.thumbnail ? decode(data.thumbnail) : undefined,
      type: 'video',
      url: url.toString(),
      width: data.media.reddit_video.width,
    }
  }

  if (data.preview?.reddit_video_preview) {
    return {
      height: data.preview.reddit_video_preview.height,
      provider: 'reddit',
      thumbnail: data.thumbnail ? decode(data.thumbnail) : undefined,
      type: 'video',
      url: decode(data.preview.reddit_video_preview.hls_url),
      width: data.preview.reddit_video_preview.width,
    }
  }
}
