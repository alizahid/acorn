import { Image } from 'expo-image'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { type PostMedia, type PostMediaMeta } from '~/types/post'

import { Text } from '../text'
import { View } from '../view'

type Props = {
  caption?: string | null
  media: PostMedia
  recyclingKey?: string
}

export function Media({ caption, media, recyclingKey }: Props) {
  const { styles } = useStyles(stylesheet)

  return (
    <View gap="2" style={styles.main}>
      <Image
        recyclingKey={recyclingKey}
        source={media.url}
        style={styles.image(media.width / media.height, media.width)}
      />

      {caption?.length ? (
        <Text align="center" highContrast={false} size="2" weight="medium">
          {caption}
        </Text>
      ) : null}
    </View>
  )
}

const stylesheet = createStyleSheet(() => ({
  image: (aspectRatio: number, width: number) => ({
    aspectRatio,
    maxHeight: width,
    width: '100%',
  }),
  main: {
    transform: [
      {
        translateY: 3,
      },
    ],
  },
}))

export function findMedia(
  url: string,
  meta?: PostMediaMeta,
): PostMedia | undefined {
  return (
    meta?.[url] ?? Object.values(meta ?? {}).find((item) => item.url === url)
  )
}
