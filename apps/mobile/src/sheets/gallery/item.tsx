import { Zoomable } from '@likashefqet/react-native-image-zoom'
import { Image, useImage } from 'expo-image'
import { useRef, useState } from 'react'
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
  onTap: () => void
}

export function GalleryItem({ image, onTap }: Props) {
  const t = useTranslations('component.posts.gallery')
  const a11y = useTranslations('a11y')

  const { styles, theme } = useStyles(stylesheet)

  const ref = useRef<Image>(null)

  const placeholder = useImagePlaceholder()

  const [playing, setPlaying] = useState(true)

  const source = useImage(image.url)

  return (
    <View style={styles.main(image.width / image.height)}>
      <Zoomable
        isDoubleTapEnabled
        isSingleTapEnabled
        minScale={0.5}
        onSingleTap={onTap}
      >
        <Image
          {...placeholder}
          accessibilityIgnoresInvertColors
          contentFit="contain"
          pointerEvents="none"
          recyclingKey={image.url}
          ref={ref}
          source={image.thumbnail ?? source}
          style={styles.image}
        />
      </Zoomable>

      {image.type === 'gif' ? (
        <View pointerEvents="box-none" style={styles.overlay}>
          <View pointerEvents="none" style={styles.gif}>
            <Text contrast size="1" weight="medium">
              {t('gif')}
            </Text>
          </View>

          <Pressable
            hitSlop={theme.space[2]}
            label={a11y(playing ? 'pause' : 'play')}
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
      ) : null}
    </View>
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  gif: {
    backgroundColor: theme.colors.black.accentAlpha,
    borderCurve: 'continuous',
    borderRadius: theme.radius[2],
    bottom: theme.space[2],
    left: theme.space[2],
    paddingHorizontal: theme.space[1],
    paddingVertical: theme.space[1] / 2,
    position: 'absolute',
  },
  image: {
    flex: 1,
  },
  main: (aspectRatio: number) => ({
    aspectRatio,
    marginVertical: 'auto',
    maxHeight: runtime.screen.height,
    width: runtime.screen.width,
  }),
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  play: {
    backgroundColor: theme.colors.black.accentAlpha,
    borderCurve: 'continuous',
    borderRadius: theme.space[4],
    bottom: theme.space[2],
    position: 'absolute',
    right: theme.space[2],
  },
}))
