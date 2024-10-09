import { Zoomable } from '@likashefqet/react-native-image-zoom'
import { Image } from 'expo-image'
import * as StatusBar from 'expo-status-bar'
import { useEffect, useRef, useState } from 'react'
import {
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
} from 'react-native-reanimated'
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from 'react-native-safe-area-context'
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
  const frame = useSafeAreaFrame()
  const insets = useSafeAreaInsets()

  const t = useTranslations('component.posts.gallery')

  const { styles, theme } = useStyles(stylesheet)

  const placeholder = useImagePlaceholder()

  const ref = useRef<Image>(null)

  const zoom = useSharedValue(1)

  const [loaded, setLoaded] = useState(!image.thumbnail)
  const [playing, setPlaying] = useState(true)
  const [zoomed, setZoomed] = useState(true)
  const [hidden, setHidden] = useState(false)
  const [margin, setMargin] = useState(0)

  useAnimatedReaction(
    () => zoom.value,
    (next) => {
      runOnJS(setZoomed)(next > 1)
    },
  )

  useEffect(() => {
    if (image.thumbnail) {
      void Image.prefetch(image.url).then(() => {
        setLoaded(true)
      })
    }
  }, [image.thumbnail, image.url])

  return (
    <View
      onLayout={(event) => {
        const bottom =
          frame.height -
          event.nativeEvent.layout.y -
          event.nativeEvent.layout.height

        const min = theme.space[4] + insets.bottom

        if (bottom < min) {
          setMargin(Math.round(min - bottom))
        }
      }}
      style={styles.main(image.width / image.height)}
    >
      <Zoomable
        isDoubleTapEnabled
        isPanEnabled={zoomed}
        isSingleTapEnabled
        maxScale={6}
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
          source={loaded ? image.url : image.thumbnail}
          style={styles.image}
        />
      </Zoomable>

      {!hidden && image.type === 'gif' ? (
        <View
          align="center"
          direction="row"
          gap="4"
          justify="center"
          style={styles.footer(margin)}
        >
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
        </View>
      ) : null}
    </View>
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  footer: (margin: number) => ({
    bottom: theme.space[2] + margin,
    left: theme.space[2],
    position: 'absolute',
    right: theme.space[2],
  }),
  image: {
    flex: 1,
  },
  label: {
    backgroundColor: theme.colors.black.a9,
    borderCurve: 'continuous',
    borderRadius: theme.radius[2],
    paddingHorizontal: theme.space[1],
    paddingVertical: theme.space[1] / 2,
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
  },
}))
