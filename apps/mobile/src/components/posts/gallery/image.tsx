import { Image } from 'expo-image'
import { useEffect, useRef, useState } from 'react'
import { StyleSheet } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { Pressable } from '~/components/common/pressable'
import { Text } from '~/components/common/text'
import { View } from '~/components/common/view'
import { useImagePlaceholder } from '~/hooks/image'
import { type PostMedia } from '~/types/post'

type Props = {
  image: PostMedia
  recyclingKey?: string
}

export function GalleryImage({ image, recyclingKey }: Props) {
  const t = useTranslations('component.posts.gallery')

  const { styles, theme } = useStyles(stylesheet)

  const placeholder = useImagePlaceholder()

  const ref = useRef<Image>(null)

  const [loaded, setLoaded] = useState(!image.thumbnail)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    if (image.thumbnail) {
      void Image.prefetch(image.url).then(() => {
        setLoaded(true)
      })
    }
  }, [image.thumbnail, image.url])

  return (
    <>
      <Image
        {...placeholder}
        contentFit="contain"
        pointerEvents="box-none"
        recyclingKey={recyclingKey}
        ref={ref}
        source={loaded ? image.url : image.thumbnail}
        style={styles.main}
      />

      {image.type === 'gif' ? (
        <View pointerEvents="box-none" style={styles.overlay}>
          <View style={styles.controls(image.width / image.height)}>
            <View style={styles.gif}>
              <Text contrast size="1" weight="medium">
                {t('gif')}
              </Text>
            </View>

            <Pressable
              hitSlop={theme.space[2]}
              onPress={() => {
                if (playing) {
                  void ref.current?.stopAnimating()
                } else {
                  void ref.current?.startAnimating()
                }

                setPlaying(!playing)
              }}
              p="2"
              style={styles.play}
            >
              <Icon
                color={theme.colors.gray.contrast}
                name={playing ? 'Pause' : 'Play'}
                size={theme.space[4]}
                weight="fill"
              />
            </Pressable>
          </View>
        </View>
      ) : null}
    </>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  controls: (aspectRatio: number) => ({
    aspectRatio,
    marginVertical: 'auto',
  }),
  gif: {
    backgroundColor: theme.colors.black.a9,
    borderCurve: 'continuous',
    borderRadius: theme.radius[2],
    bottom: theme.space[2],
    left: theme.space[2],
    paddingHorizontal: theme.space[1],
    paddingVertical: theme.space[1] / 2,
    position: 'absolute',
  },
  main: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  play: {
    backgroundColor: theme.colors.black.a9,
    borderCurve: 'continuous',
    borderRadius: theme.space[4],
    bottom: theme.space[2],
    position: 'absolute',
    right: theme.space[2],
  },
}))
