import { type PostMediaMeta } from '~/types/post'

type FindImageProps = {
  href: string
  meta?: PostMediaMeta
  width: number
}

export function findImage({ href, meta, width }: FindImageProps) {
  const image = Object.values(meta ?? {}).find((item) => item.url === href)

  if (!image) {
    return
  }

  const height = (image.height / image.width) * width

  return {
    height,
    url: image.url,
    width,
  }
}
