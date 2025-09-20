import { openPreview } from '@baronha/react-native-multiple-image-picker'

import { type PostMedia } from '~/types/post'

export function previewVideo(video: PostMedia) {
  openPreview([
    {
      path: video.url,
      thumbnail: video.thumbnail,
      type: 'video',
    },
  ])
}

export function previewImages(images: Array<PostMedia>, index?: number) {
  openPreview(
    images.map((image) => ({
      path: image.url,
      thumbnail: image.thumbnail,
      type: 'image',
    })),
    index,
  )
}
