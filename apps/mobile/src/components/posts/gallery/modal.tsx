import * as StatusBar from 'expo-status-bar'
import { useCallback, useEffect, useState } from 'react'
import { Modal, StyleSheet } from 'react-native'
import {
  FlatList,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler'
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaFrame } from 'react-native-safe-area-context'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Text } from '~/components/common/text'
import { HeaderButton } from '~/components/navigation/header-button'
import { usePreferences } from '~/stores/preferences'
import { oledTheme } from '~/styles/oled'
import { type PostMedia } from '~/types/post'

import { GalleryImage } from './image'

type Props = {
  images: Array<PostMedia>
  initialIndex?: number
  onClose: () => void
  recyclingKey?: string
  visible: boolean
}

export function PostGalleryModal({
  images,
  initialIndex,
  onClose,
  recyclingKey,
  visible,
}: Props) {
  const frame = useSafeAreaFrame()

  const { themeOled, themeTint } = usePreferences()

  const t = useTranslations('component.posts.gallery')

  const { styles } = useStyles(stylesheet)

  const translate = useSharedValue(frame.height)
  const opacity = useSharedValue(0)

  const [hidden, setHidden] = useState(false)
  const [viewing, setViewing] = useState<PostMedia>()

  useEffect(() => {
    if (visible) {
      translate.set(() => withTiming(0))
      opacity.set(() => withTiming(1))
    }
  }, [opacity, translate, visible])

  const main = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: translate.get(),
      },
    ],
  }))

  const overlay = useAnimatedStyle(() => ({
    opacity: interpolate(
      translate.get(),
      [-frame.height, 0, frame.height],
      [0, 1, 0],
    ),
  }))

  const controls = useAnimatedStyle(() => ({
    opacity: opacity.get(),
  }))

  const close = useCallback(
    (direction: 'up' | 'down' = 'down') => {
      opacity.set(() => withTiming(0))

      translate.set(() =>
        withTiming(
          direction === 'up' ? -frame.height : frame.height,
          undefined,
          () => {
            runOnJS(onClose)()
            runOnJS(StatusBar.setStatusBarHidden)(false, 'fade')
            runOnJS(setHidden)(false)

            translate.set(frame.height)
          },
        ),
      )
    },
    [frame.height, onClose, opacity, translate],
  )

  const first = images[0]

  if (!first) {
    return null
  }

  const gesture = Gesture.Pan()
    .maxPointers(1)
    .onUpdate((event) => {
      translate.set(event.translationY)

      opacity.set(() =>
        interpolate(
          event.translationY,
          [-(frame.height * 0.5), 0, frame.height * 0.5],
          [0, 1, 0],
        ),
      )
    })
    .onEnd((event) => {
      if (
        Math.abs(event.translationY) > 100 ||
        Math.abs(event.velocityY) > 1_000
      ) {
        runOnJS(close)(event.translationY < 0 ? 'up' : 'down')
      } else {
        translate.set(() => withTiming(0))
      }
    })

  return (
    <Modal transparent visible={visible}>
      <Animated.View
        pointerEvents="none"
        style={[styles.overlay(themeOled, themeTint), overlay]}
      />

      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.main, main]}>
          <FlatList
            data={images}
            decelerationRate="fast"
            getItemLayout={(data, index) => ({
              index,
              length: frame.width,
              offset: frame.width * index,
            })}
            horizontal
            initialNumToRender={3}
            initialScrollIndex={initialIndex}
            keyExtractor={(item, index) => String(index)}
            onViewableItemsChanged={({ viewableItems }) => {
              setViewing(() => viewableItems[0]?.item)
            }}
            renderItem={({ item }) => (
              <GalleryImage
                image={item}
                onTap={() => {
                  const next = !hidden

                  StatusBar.setStatusBarHidden(next, 'fade')

                  setHidden(next)

                  opacity.set(() => withTiming(next ? 0 : 1))
                }}
                recyclingKey={recyclingKey}
                styleControls={controls}
              />
            )}
            scrollEnabled={images.length > 1}
            showsHorizontalScrollIndicator={false}
            snapToOffsets={images.map((item, index) => frame.width * index)}
            viewabilityConfig={{
              viewAreaCoveragePercentThreshold: 60,
            }}
          />
        </Animated.View>
      </GestureDetector>

      {images.length > 1 ? (
        <Animated.View
          pointerEvents="none"
          style={[styles.pagination, controls]}
        >
          <Text contrast size="1" tabular weight="medium">
            {t('item', {
              count: images.length,
              current: (viewing ? images.indexOf(viewing) : 0) + 1,
            })}
          </Text>
        </Animated.View>
      ) : null}

      <Animated.View pointerEvents="box-none" style={[styles.close, controls]}>
        <HeaderButton
          icon="X"
          onPress={() => {
            close()
          }}
          weight="bold"
        />
      </Animated.View>
    </Modal>
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  close: {
    position: 'absolute',
    right: theme.space[4],
    top: theme.space[4] + runtime.insets.top,
  },
  main: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: (oled: boolean, bg: boolean) => ({
    ...StyleSheet.absoluteFillObject,
    backgroundColor: oled
      ? oledTheme[theme.name].bg
      : theme.colors[bg ? 'accent' : 'gray'].ui,
  }),
  pagination: {
    alignSelf: 'center',
    backgroundColor: theme.colors.black.accentAlpha,
    borderCurve: 'continuous',
    borderRadius: theme.radius[2],
    paddingHorizontal: theme.space[1],
    paddingVertical: theme.space[1] / 2,
    position: 'absolute',
    top: theme.space[4] + runtime.insets.top,
  },
}))
