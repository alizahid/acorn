import { type PostMedia, type PostMediaMeta } from '~/types/post'

type FindMediaProps = {
  frameWidth: number
  href: string
  meta?: PostMediaMeta
}

export function findMedia({
  frameWidth,
  href,
  meta,
}: FindMediaProps): PostMedia | undefined {
  const media = Object.values(meta ?? {}).find((item) => item.url === href)

  if (media) {
    const height = (media.height / media.width) * frameWidth

    return {
      height,
      type: media.type,
      url: media.url,
      width: frameWidth,
    }
  }
}
