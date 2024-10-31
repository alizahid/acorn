import { Image } from 'expo-image'
import { useState } from 'react'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { PostGalleryModal } from '~/components/posts/gallery/modal'
import { useImagePlaceholder } from '~/hooks/image'
import { type PostMedia, type PostMediaMeta } from '~/types/post'

import { Pressable } from '../pressable'
import { Text } from '../text'
import { type MarkdownVariant } from '.'

type Props = {
  caption?: string | null
  media: PostMedia
  recyclingKey?: string
  variant: MarkdownVariant
}

export function Media({ caption, media, recyclingKey, variant }: Props) {
  const { styles } = useStyles(stylesheet)

  const placeholder = useImagePlaceholder()

  const [visible, setVisible] = useState(false)

  return (
    <>
      <Pressable
        align={variant === 'post' ? 'center' : undefined}
        disabled={media.width < 100}
        gap="2"
        onPress={() => {
          setVisible(true)
        }}
        style={styles.main(media.height, media.width)}
      >
        <Image
          {...placeholder}
          contentFit="contain"
          recyclingKey={recyclingKey}
          source={media.url}
          style={styles.image}
        />

        {caption?.length ? (
          <Text align="center" highContrast={false} size="2" weight="medium">
            {caption}
          </Text>
        ) : null}
      </Pressable>

      {media.width > 100 ? (
        <PostGalleryModal
          images={[media]}
          onClose={() => {
            setVisible(false)
          }}
          visible={visible}
        />
      ) : null}
    </>
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  image: {
    flex: 1,
    width: '100%',
  },
  main: (height: number, width: number) => ({
    alignSelf: width > runtime.screen.width ? 'center' : undefined,
    aspectRatio: width / height,
    maxHeight: width,
    width: '100%',
  }),
  modal: {
    justifyContent: 'center',
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
