import { Zoomable } from '@likashefqet/react-native-image-zoom'
import { Image, useImage } from 'expo-image'
import { useRef, useState } from 'react'
import { type StyleProp, StyleSheet, type ViewStyle } from 'react-native'
import Animated from 'react-native-reanimated'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { Pressable } from '~/components/common/pressable'
import { Text } from '~/components/common/text'
import { View } from '~/components/common/view'
import { HeaderButton } from '~/components/navigation/header-button'
import {
  useCopyImage,
  useDownloadImage,
  useImagePlaceholder,
} from '~/hooks/image'
import { type PostMedia } from '~/types/post'

type Props = {
  image: PostMedia
  onTap?: () => void
  recyclingKey?: string
  styleControls?: StyleProp<ViewStyle>
}

export function GalleryImage({
  image,
  onTap,
  recyclingKey,
  styleControls,
}: Props) {
  const t = useTranslations('component.posts.gallery')

  const { styles, theme } = useStyles(stylesheet)

  const placeholder = useImagePlaceholder()
  const download = useDownloadImage()
  const copy = useCopyImage()

  const ref = useRef<Image>(null)

  const [playing, setPlaying] = useState(true)

  const source = useImage(image.url)

  return (
    <View style={styles.main}>
      <Zoomable
        isDoubleTapEnabled
        isSingleTapEnabled
        maxScale={6}
        minScale={0.5}
        onSingleTap={() => {
          onTap?.()
        }}
      >
        <Image
          {...placeholder}
          contentFit="contain"
          pointerEvents="none"
          recyclingKey={recyclingKey}
          ref={ref}
          source={source ?? image.thumbnail}
          style={styles.image}
        />
      </Zoomable>

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

      <Animated.View
        pointerEvents="box-none"
        style={[styles.footer, styleControls]}
      >
        <HeaderButton
          color={
            download.isError ? 'red' : download.isSuccess ? 'green' : 'accent'
          }
          icon={
            download.isError
              ? 'XCircle'
              : download.isSuccess
                ? 'CheckCircle'
                : 'Download'
          }
          loading={download.isPending}
          onPress={() => {
            download.download({
              url: image.url,
            })
          }}
          weight={
            download.isError ? 'fill' : download.isSuccess ? 'fill' : 'duotone'
          }
        />

        <HeaderButton
          color={copy.isError ? 'red' : copy.isSuccess ? 'green' : 'accent'}
          icon={
            copy.isError ? 'XCircle' : copy.isSuccess ? 'CheckCircle' : 'Copy'
          }
          loading={copy.isPending}
          onPress={() => {
            copy.copy({
              url: image.url,
            })
          }}
          weight={copy.isError ? 'fill' : copy.isSuccess ? 'fill' : 'duotone'}
        />
      </Animated.View>
    </View>
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  controls: (aspectRatio: number) => ({
    aspectRatio,
    marginVertical: 'auto',
  }),
  footer: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: theme.colors.black.a9,
    borderCurve: 'continuous',
    borderRadius: theme.space[9],
    bottom: theme.space[9] + runtime.insets.bottom,
    flexDirection: 'row',
    justifyContent: 'center',
    overflow: 'hidden',
    paddingHorizontal: theme.space[2],
    position: 'absolute',
  },
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
  image: {
    flex: 1,
  },
  main: {
    width: runtime.screen.width,
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
