import { Gallery } from '~/components/gallery'
import { type PostMedia } from '~/types/post'

export function previewImages(images: Array<PostMedia>, index?: number) {
  Gallery.call({
    initial: index,
    media: images,
  })
}
