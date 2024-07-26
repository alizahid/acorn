import { Image } from 'expo-image'
import { FlatList } from 'react-native'
import { useSafeAreaFrame } from 'react-native-safe-area-context'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { getDimensions } from '~/lib/media'
import { type PostImage } from '~/types/post'

type Props = {
  images: Array<PostImage>
  margin?: number
}

export function PostImages({ images, margin = 0 }: Props) {
  const frame = useSafeAreaFrame()

  const { styles } = useStyles(stylesheet)

  if (images.length === 1) {
    const height = getDimensions(frame.width, images[0])

    return (
      <Image
        contentFit="contain"
        source={images[0].url}
        style={[
          styles.main(margin, frame.width),
          styles.image(height, frame.width),
        ]}
      />
    )
  }

  return (
    <FlatList
      data={images}
      decelerationRate="fast"
      horizontal
      renderItem={({ item }) => (
        <Image
          contentFit="contain"
          source={item.url}
          style={styles.image(frame.width, frame.width)}
        />
      )}
      snapToOffsets={images.map((image, index) => frame.width * index)}
      style={styles.main(margin, frame.width)}
    />
  )
}

const stylesheet = createStyleSheet((theme) => ({
  image: (height: number, width: number) => ({
    height,
    width,
  }),
  main: (margin: number, height: number) => ({
    backgroundColor: theme.colors.grayA[3],
    height,
    marginHorizontal: -margin,
    width: height,
  }),
}))
