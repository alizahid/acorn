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
import { useCommon } from '~/hooks/common'
import { useImagePlaceholder } from '~/hooks/image'
import { getDimensions } from '~/lib/media'
import { type PostMedia } from '~/types/post'

type Props = {
  image: PostMedia
  recyclingKey?: string
}

export function GalleryImage({ image, recyclingKey }: Props) {
  const t = useTranslations('component.posts.gallery')

  const common = useCommon()

  const { styles, theme } = useStyles(stylesheet)

  const placeholder = useImagePlaceholder()

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

  const dimensions = getDimensions(common.frame.width, image)

  return (
    <View
      style={styles.main(
        common.frame.height,
        dimensions.height,
        dimensions.width,
      )}
    >
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
  )
}

const stylesheet = createStyleSheet((theme) => ({
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
  main: (maxHeight: number, height: number, width: number) => ({
    alignSelf: 'center',
    height,
    maxHeight,
    width,
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
