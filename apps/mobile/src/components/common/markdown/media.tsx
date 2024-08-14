import { View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { PostGalleryCard } from '~/components/posts/gallery'
import { getDimensions } from '~/lib/media'
import { type PostMedia, type PostMediaMeta } from '~/types/post'

import { Text } from '../text'

type Props = {
  caption?: string
  margin?: number
  media: PostMedia
  recyclingKey?: string
}

export function Media({ caption, margin = 0, media, recyclingKey }: Props) {
  const { styles } = useStyles(stylesheet)

  return (
    <View style={styles.main}>
      <PostGalleryCard
        images={[media]}
        margin={margin}
        maxHeight={10_000}
        recyclingKey={recyclingKey}
      />

      {caption?.length ? (
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
  meta?: PostMediaMeta
  url: string
}

export function findMedia({
  frameWidth,
  meta,
  url,
}: FindMediaProps): PostMedia | undefined {
  const one = meta?.[url]

  if (one) {
    const { height, width } = getDimensions(frameWidth, one, true)

    return {
      height,
      type: one.type,
      url: one.url,
      width,
    }
  }

  const two = Object.values(meta ?? {}).find((item) => item.url === url)

  if (two) {
    const { height, width } = getDimensions(frameWidth, two, true)

    return {
      height,
      type: two.type,
      url: two.url,
      width,
    }
  }
}
