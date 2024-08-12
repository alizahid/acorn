import { Image } from 'expo-image'
import { type ReactNode } from 'react'
import { View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { useImagePlaceholder } from '~/hooks/image'
import { getDimensions } from '~/lib/media'
import { type PostMedia, type PostMediaMeta } from '~/types/post'

import { Text } from '../text'

type Props = {
  caption?: ReactNode
  media: PostMedia
}

export function MarkdownMedia({ caption, media }: Props) {
  const { styles } = useStyles(stylesheet)

  const placeholder = useImagePlaceholder()

  return (
    <View style={styles.main}>
      <Image
        {...placeholder}
        source={media.url}
        style={styles.image(media.height, media.width)}
      />

      {caption && caption !== '' ? (
        <Text align="center" highContrast={false} size="2" weight="medium">
          {caption}
        </Text>
      ) : null}
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  image: (height: number, width: number) => ({
    height,
    width,
  }),
  main: {
    gap: theme.space[2],
    marginTop: -3,
    paddingTop: 3,
  },
}))

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
    const { height, width } = getDimensions(frameWidth, media)

    return {
      height,
      type: media.type,
      url: media.url,
      width,
    }
  }
}
