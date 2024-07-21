import { type ListingsSchema } from '~/schemas/reddit/listings'
import { type PostVideo } from '~/types/post'

export function getImageUrl(url: string) {
  return url.replaceAll('&amp;', '&')
}

export function getVideo(
  media: ListingsSchema['data']['children'][number]['data']['media'],
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
