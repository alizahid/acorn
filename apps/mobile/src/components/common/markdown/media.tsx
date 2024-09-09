import { Image } from 'expo-image'
import * as StatusBar from 'expo-status-bar'
import { useState } from 'react'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { GalleryImage } from '~/components/posts/gallery/image'
import { type PostMedia, type PostMediaMeta } from '~/types/post'

import { FakeModal } from '../fake-modal'
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
      >
        <Image
          recyclingKey={recyclingKey}
          source={media.url}
          style={styles.image(media.height, media.width)}
        />

        {caption?.length ? (
          <Text align="center" highContrast={false} size="2" weight="medium">
            {caption}
          </Text>
        ) : null}
      </Pressable>

      {media.width > 100 ? (
        <FakeModal
          close
          onClose={() => {
            setVisible(false)

            StatusBar.setStatusBarHidden(false, 'fade')
          }}
          style={styles.modal}
          visible={visible}
        >
          <GalleryImage image={media} recyclingKey={recyclingKey} />
        </FakeModal>
      ) : null}
    </>
  )
}

const stylesheet = createStyleSheet(() => ({
  image: (height: number, width: number) => ({
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
