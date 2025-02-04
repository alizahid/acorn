import * as ScreenOrientation from 'expo-screen-orientation'
import { useEffect, useRef, useState } from 'react'
import { createCallable } from 'react-call'
import { StyleSheet } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaFrame } from 'react-native-safe-area-context'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { IconButton } from '~/components/common/icon-button'
import { Text } from '~/components/common/text'
import { useCopyImage, useDownloadImage } from '~/hooks/image'
import { usePreferences } from '~/stores/preferences'
import { oledTheme } from '~/styles/oled'
import { type PostMedia } from '~/types/post'

import { GalleryItem } from './item'

type Props = {
  images: Array<PostMedia>
  initial?: number
}

export const Gallery = createCallable<Props>(({ call, images, initial }) => {
  const frame = useSafeAreaFrame()

  const t = useTranslations('component.posts.gallery')

  const { themeOled, themeTint } = usePreferences()

  const { styles } = useStyles(stylesheet)

  const mounted = useRef(false)

  const download = useDownloadImage()
  const copy = useCopyImage()

  const translate = useSharedValue(frame.height)
  const opacity = useSharedValue(0)

  const overlay = useAnimatedStyle(() => ({
    opacity: interpolate(
      translate.get(),
      [-frame.height, 0, frame.height],
      [0, 1, 0],
    ),
  }))

  const list = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: translate.get(),
      },
    ],
  }))

  const controls = useAnimatedStyle(() => ({
    opacity: opacity.get(),
  }))

  useEffect(() => {
    if (call.ended) {
      translate.set(() => withTiming(frame.height))
      opacity.set(() => withTiming(0))

      void ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP,
      )

      return
    }

    if (mounted.current) {
      return
    }

    mounted.current = true

    translate.set(() => withTiming(0))
    opacity.set(() => withTiming(1))

    void ScreenOrientation.unlockAsync()
  }, [call.ended, frame.height, opacity, translate])

  const [viewing, setViewing] = useState(initial ?? 0)

  const onScroll = useAnimatedScrollHandler((event) => {
    const next = Math.round(event.contentOffset.x / frame.width)

    runOnJS(setViewing)(next)
  })

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translate.set(() => event.translationY)
    })
    .onEnd((event) => {
      if (Math.abs(event.translationY) > 100 || event.velocityY > 1_000) {
        runOnJS(call.end)()

        return
      }

      translate.set(() => withTiming(0))
    })

  const selected = images[viewing]

  return (
    <Animated.View style={styles.main}>
      <Animated.View style={[styles.overlay(themeOled, themeTint), overlay]} />

      <GestureDetector gesture={gesture}>
        <Animated.FlatList
          contentContainerStyle={styles.content}
          data={images}
          decelerationRate="fast"
          getItemLayout={(data, index) => ({
            index,
            length: frame.width,
            offset: frame.width * index,
          })}
          horizontal
          initialScrollIndex={initial}
          keyExtractor={(item) => item.url}
          onScroll={onScroll}
          renderItem={({ item }) => <GalleryItem image={item} />}
          scrollEnabled={images.length > 1}
          showsHorizontalScrollIndicator={false}
          snapToOffsets={images.map((image, index) => frame.width * index)}
          style={list}
        />
      </GestureDetector>

      {images.length > 1 ? (
        <Animated.View
          pointerEvents="none"
          style={[styles.pagination, controls]}
        >
          <Text contrast size="1" tabular weight="medium">
            {t('item', {
              count: images.length,
              current: viewing + 1,
            })}
          </Text>
        </Animated.View>
      ) : null}

      <Animated.View pointerEvents="box-none" style={[styles.close, controls]}>
        <IconButton
          icon={{
            name: 'X',
            weight: 'bold',
          }}
          onPress={() => {
            call.end()
          }}
        />
      </Animated.View>

      {selected ? (
        <Animated.View
          pointerEvents="box-none"
          style={[styles.footer, controls]}
        >
          <IconButton
            icon={{
              color: download.isError
                ? 'red'
                : download.isSuccess
                  ? 'green'
                  : 'accent',

              name: download.isError
                ? 'XCircle'
                : download.isSuccess
                  ? 'CheckCircle'
                  : 'Download',
              weight: download.isError
                ? 'fill'
                : download.isSuccess
                  ? 'fill'
                  : 'duotone',
            }}
            loading={download.isPending}
            onPress={() => {
              download.download({
                url: selected.url,
              })
            }}
          />

          <IconButton
            icon={{
              color: copy.isError ? 'red' : copy.isSuccess ? 'green' : 'accent',
              name: copy.isError
                ? 'XCircle'
                : copy.isSuccess
                  ? 'CheckCircle'
                  : 'Copy',
              weight: copy.isError
                ? 'fill'
                : copy.isSuccess
                  ? 'fill'
                  : 'duotone',
            }}
            loading={copy.isPending}
            onPress={() => {
              copy.copy({
                url: selected.url,
              })
            }}
          />
        </Animated.View>
      ) : null}
    </Animated.View>
  )
}, 250)

const stylesheet = createStyleSheet((theme, runtime) => ({
  close: {
    position: 'absolute',
    right: theme.space[4],
    top: theme.space[4] + runtime.insets.top,
  },
  content: {
    alignItems: 'center',
  },
  footer: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: theme.colors.black.accentAlpha,
    borderCurve: 'continuous',
    borderRadius: theme.space[9],
    bottom: theme.space[9] + runtime.insets.bottom,
    flexDirection: 'row',
    justifyContent: 'center',
    overflow: 'hidden',
    paddingHorizontal: theme.space[2],
    position: 'absolute',
  },
  main: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
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
