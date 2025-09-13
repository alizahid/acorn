// biome-ignore lint/performance/noNamespaceImport: go away
import * as StatusBar from 'expo-status-bar'
import { useEffect, useRef, useState } from 'react'
import { createCallable } from 'react-call'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaFrame } from 'react-native-safe-area-context'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { IconButton } from '~/components/common/icon/button'
import { Text } from '~/components/common/text'
import { View } from '~/components/common/view'
import { useDownloadImages } from '~/hooks/image'
import { lockOrientation, unlockOrientation } from '~/lib/orientation'
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
  const a11y = useTranslations('a11y')

  const { themeOled, themeTint } = usePreferences()

  styles.useVariants({
    oled: themeOled,
    tint: themeTint,
  })

  const mounted = useRef(false)

  const download = useDownloadImages()

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
      StatusBar.setStatusBarHidden(false, 'fade')

      lockOrientation()

      return
    }

    if (mounted.current) {
      return
    }

    mounted.current = true

    translate.set(() => withTiming(0))
    opacity.set(() => withTiming(1))

    unlockOrientation()
  }, [call.ended, opacity.set, translate.set])

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
      if (Math.abs(event.translationY) > 100) {
        opacity.set(() => withTiming(0))
        translate.set(() =>
          withSpring(event.translationY > 0 ? frame.height : -frame.height),
        )

        runOnJS(call.end)()

        return
      }

      translate.set(() => withTiming(0))
    })

  return (
    <Animated.View style={styles.main}>
      <Animated.View style={[styles.overlay, overlay]} />

      <GestureDetector gesture={gesture}>
        <Animated.FlatList
          data={images}
          decelerationRate="fast"
          getItemLayout={(_data, index) => ({
            index,
            length: frame.width,
            offset: frame.width * index,
          })}
          horizontal
          initialScrollIndex={initial}
          keyExtractor={(item) => item.url}
          onScroll={onScroll}
          renderItem={({ item }) => (
            <GalleryItem
              image={item}
              onTap={() => {
                if (opacity.get() > 0) {
                  opacity.set(() => withTiming(0))

                  StatusBar.setStatusBarHidden(true, 'fade')
                } else {
                  opacity.set(() => withTiming(1))

                  StatusBar.setStatusBarHidden(false, 'fade')
                }
              }}
            />
          )}
          scrollEnabled={images.length > 1}
          showsHorizontalScrollIndicator={false}
          snapToOffsets={images.map((_image, index) => frame.width * index)}
          style={list}
        />
      </GestureDetector>

      <Animated.View pointerEvents="box-none" style={[styles.header, controls]}>
        {images.length > 1 ? (
          <View pointerEvents="none" style={styles.pagination}>
            <Text contrast size="1" tabular weight="medium">
              {t('item', {
                count: images.length,
                current: viewing + 1,
              })}
            </Text>
          </View>
        ) : null}

        <IconButton
          icon="xmark"
          label={a11y('close')}
          onPress={() => {
            translate.set(() => withSpring(frame.height))
            opacity.set(() => withTiming(0))

            call.end()
          }}
          style={styles.close}
        />
      </Animated.View>

      {images.length > 1 ? (
        <Animated.View
          pointerEvents="box-none"
          style={[styles.footer, controls]}
        >
          <IconButton
            icon="square.and.arrow.down"
            label={a11y('downloadGallery')}
            loading={download.isPending}
            onPress={() => {
              download.download({
                urls: images.map((image) => image.url),
              })
            }}
          />
        </Animated.View>
      ) : null}
    </Animated.View>
  )
}, 250)

const styles = StyleSheet.create((theme, runtime) => ({
  close: {
    marginLeft: 'auto',
  },
  footer: {
    alignItems: 'center',
    alignSelf: 'center',
    bottom: theme.space[9] + runtime.insets.bottom,
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    left: theme.space[4],
    position: 'absolute',
    right: theme.space[4],
    top: theme.space[4] + runtime.insets.top,
  },
  main: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.gray.ui,
    variants: {
      oled: {
        true: {
          backgroundColor: oledTheme[theme.variant].bg,
        },
      },
      tint: {
        true: {
          backgroundColor: theme.colors.accent.ui,
        },
      },
    },
  },
  pagination: {
    backgroundColor: theme.colors.black.accentAlpha,
    borderCurve: 'continuous',
    borderRadius: theme.radius[2],
    justifyContent: 'center',
    paddingHorizontal: theme.space[1],
    paddingVertical: theme.space[1] / 2,
  },
}))
