import { Zoomable } from '@likashefqet/react-native-image-zoom'
import { Image } from 'expo-image'
import * as StatusBar from 'expo-status-bar'
import { useRef, useState } from 'react'
import {
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
} from 'react-native-reanimated'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { Pressable } from '~/components/common/pressable'
import { Text } from '~/components/common/text'
import { View } from '~/components/common/view'
import { HeaderButton } from '~/components/navigation/header-button'
import { useDownloadImage, useImagePlaceholder } from '~/hooks/image'
import { type PostMedia } from '~/types/post'

type Props = {
  image: PostMedia
  recyclingKey?: string
}

export function GalleryImage({ image, recyclingKey }: Props) {
  const t = useTranslations('component.posts.gallery')

  const { styles, theme } = useStyles(stylesheet)

  const placeholder = useImagePlaceholder()
  const download = useDownloadImage()

  const ref = useRef<Image>(null)

  const zoom = useSharedValue(1)

  const [playing, setPlaying] = useState(true)
  const [zoomed, setZoomed] = useState(true)
  const [hidden, setHidden] = useState(false)

  useAnimatedReaction(
    () => zoom.value,
    (next) => {
      runOnJS(setZoomed)(next > 1)
    },
  )

  return (
    <>
      <View style={styles.main(image.width / image.height)}>
        <Zoomable
          isDoubleTapEnabled
          isPanEnabled={zoomed}
          isSingleTapEnabled
          maxScale={6}
          minPanPointers={1}
          minScale={0.5}
          onSingleTap={() => {
            StatusBar.setStatusBarHidden(!hidden, 'fade')

            setHidden(!hidden)
          }}
          scale={zoom}
        >
          <Image
            {...placeholder}
            allowDownscaling={false}
            contentFit="contain"
            recyclingKey={recyclingKey}
            ref={ref}
            source={image.url}
            style={styles.image}
          />
        </Zoomable>

        {image.type === 'gif' ? (
          <>
            <View style={styles.label}>
              <Text contrast size="1">
                {t('gif')}
              </Text>
            </View>

            <Pressable
              hitSlop={theme.space[3]}
              onPress={() => {
                if (playing) {
                  void ref.current?.stopAnimating()

                  setPlaying(false)
                } else {
                  void ref.current?.startAnimating()

                  setPlaying(true)
                }
              }}
              p="2"
              style={styles.play}
            >
              <Icon
                color={theme.colors.white.a11}
                name={playing ? 'Pause' : 'Play'}
                size={theme.space[4]}
                weight="fill"
              />
            </Pressable>
          </>
        ) : null}
      </View>

      <View direction="row" justify="center" style={styles.footer}>
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
        />
      </View>
    </>
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  footer: {
    bottom: theme.space[4] + runtime.insets.bottom,
    left: theme.space[4],
    position: 'absolute',
    right: theme.space[4],
  },
  image: {
    flex: 1,
  },
  label: {
    backgroundColor: theme.colors.black.a9,
    borderCurve: 'continuous',
    borderRadius: theme.radius[2],
    bottom: theme.space[2],
    left: theme.space[2],
    paddingHorizontal: theme.space[1],
    paddingVertical: theme.space[1] / 2,
    position: 'absolute',
  },
  main: (aspectRatio: number) => ({
    alignSelf: 'center',
    aspectRatio,
    maxHeight: runtime.screen.height,
    width: runtime.screen.width,
  }),
  play: {
    backgroundColor: theme.colors.black.a9,
    borderCurve: 'continuous',
    borderRadius: theme.space[4],
    bottom: theme.space[2],
    position: 'absolute',
    right: theme.space[2],
  },
}))
