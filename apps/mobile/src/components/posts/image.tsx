import { Image } from 'expo-image'
import { useSafeAreaFrame } from 'react-native-safe-area-context'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { getDimensions } from '~/lib/media'
import { type PostImage } from '~/types/post'

import { PostGalleryCard } from './gallery'

type Props = {
  images: Array<PostImage>
}

export function PostImageCard({ images }: Props) {
  const frame = useSafeAreaFrame()

  const { styles } = useStyles(stylesheet)

  if (images.length === 1) {
    const { height } = getDimensions(frame.width, images[0])

    return (
      <Image
        contentFit="contain"
        source={images[0].url}
        style={[styles.main(height, frame.width)]}
      />
    )
  }

  return <PostGalleryCard images={images} />
}

const stylesheet = createStyleSheet((theme) => ({
  main: (height: number, width: number) => ({
    backgroundColor: theme.colors.gray.a3,
    height,
    width,
  }),
}))
