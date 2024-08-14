import { type ReactNode } from 'react'
import { View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { PostGalleryCard } from '~/components/posts/gallery'
import { getDimensions } from '~/lib/media'
import { type PostMedia, type PostMediaMeta } from '~/types/post'

import { Text } from '../text'

type Props = {
  caption?: ReactNode
  margin?: number
  media: PostMedia
  recyclingKey?: string
}

export function MarkdownMedia({
  caption,
  margin = 0,
  media,
  recyclingKey,
}: Props) {
  const { styles } = useStyles(stylesheet)

  return (
    <View style={styles.main}>
      <PostGalleryCard
        images={[media]}
        margin={margin}
        recyclingKey={recyclingKey}
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
