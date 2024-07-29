import { Image, type ImageStyle } from 'expo-image'
import { type StyleProp } from 'react-native'
import { useSafeAreaFrame } from 'react-native-safe-area-context'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { getDimensions } from '~/lib/media'
import { type PostImage } from '~/types/post'

import { PostGalleryCard } from './gallery'

type Props = {
  images: Array<PostImage>
  margin?: number
  style?: StyleProp<ImageStyle>
}

export function PostImageCard({ images, margin = 0, style }: Props) {
  const frame = useSafeAreaFrame()

  const { styles } = useStyles(stylesheet)

  if (images.length === 1) {
    const { height } = getDimensions(frame.width - margin, images[0])

    return (
      <Image
        contentFit="contain"
        source={images[0].url}
        style={[styles.main(height, frame.width - margin), style]}
      />
    )
  }

  return <PostGalleryCard images={images} style={style} />
}

const stylesheet = createStyleSheet((theme) => ({
  main: (height: number, width: number) => ({
    backgroundColor: theme.colors.gray.a3,
    height,
    width,
  }),
}))
