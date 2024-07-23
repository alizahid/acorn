import { Image } from 'expo-image'
import { FlatList } from 'react-native'
import { useSafeAreaFrame } from 'react-native-safe-area-context'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { getDimensions } from '~/lib/media'
import { type PostImage } from '~/types/post'

type Props = {
  images: Array<PostImage>
}

export function PostImages({ images }: Props) {
  const frame = useSafeAreaFrame()

  const { styles } = useStyles(stylesheet)

  if (images.length === 1) {
    const height = getDimensions(frame.width, images[0])

    return (
      <Image
        contentFit="contain"
        source={images[0].url}
        style={[styles.main(frame.width), styles.image(height, frame.width)]}
      />
    )
  }

  return (
    <FlatList
      data={images}
      horizontal
      renderItem={({ item }) => (
        <Image
          contentFit="contain"
          source={item.url}
          style={styles.main(frame.width)}
        />
      )}
      snapToOffsets={images.map((image, index) => frame.width * index)}
      style={styles.main(frame.width)}
    />
  )
}

const stylesheet = createStyleSheet((theme) => ({
  image: (height: number, width: number) => ({
    height,
    width,
  }),
  main: (height: number) => ({
    backgroundColor: theme.colors.grayA[3],
    height,
    width: height,
  }),
}))
