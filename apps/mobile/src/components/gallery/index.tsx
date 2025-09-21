import { FlashList } from '@shopify/flash-list'
import { StatusBar } from 'expo-status-bar'
import { range } from 'lodash'
import { useEffect, useState } from 'react'
import { createCallable } from 'react-call'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaFrame } from 'react-native-safe-area-context'
import { StyleSheet } from 'react-native-unistyles'
import { scheduleOnRN } from 'react-native-worklets'

import { type PostMedia } from '~/types/post'

import { IconButton } from '../common/icon/button'
import { View } from '../common/view'
import { GalleryImage } from './image'
import { GalleryVideo } from './video'

type Props = {
  initial?: number
  media: Array<PostMedia>
}

export const Gallery = createCallable<Props>(({ call, media, initial }) => {
  const frame = useSafeAreaFrame()

  const translate = useSharedValue(frame.height)

  const [index, setIndex] = useState(initial ?? 0)

  const overlay = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      translate.get(),
      [-frame.height, 0, frame.height],
      ['rgba(0, 0, 0, 0)', '#000', 'rgba(0, 0, 0, 0)'],
    ),
  }))

  const controls = useAnimatedStyle(() => ({
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

  useEffect(() => {
    translate.set(
      withTiming(0, {
        duration: 100,
      }),
    )
  }, [translate.set])

  const pan = Gesture.Pan()
    .onUpdate((event) => {
      translate.set(event.translationY)
    })
    .onEnd((event) => {
      if (
        event.velocityY > 1000 ||
        event.translationY > frame.height * 0.25 ||
        event.translationY < 0 - frame.height * 0.25
      ) {
        translate.set(
          withTiming(
            event.translationY > 0 ? frame.height : -frame.height,
            {
              duration: 100,
            },
            () => {
              scheduleOnRN(call.end)
            },
          ),
        )
      } else {
        translate.set(
          withTiming(0, {
            duration: 100,
          }),
        )
      }
    })

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.main, overlay]}>
        <StatusBar style="light" />

        <Animated.View style={list}>
          <FlashList
            data={media}
            decelerationRate="fast"
            horizontal
            initialScrollIndex={initial}
            keyExtractor={(item) => item.url}
            onScroll={(event) => {
              setIndex(
                Math.round(event.nativeEvent.contentOffset.x / frame.width),
              )
            }}
            renderItem={({ item }) => {
              if (item.type === 'video') {
                return <GalleryVideo item={item} />
              }

              return <GalleryImage item={item} />
            }}
            scrollEnabled={media.length > 1}
            showsHorizontalScrollIndicator={false}
            snapToInterval={frame.width}
          />
        </Animated.View>

        <Animated.View style={[styles.controls, controls]}>
          {media.length > 1 ? (
            <View
              align="center"
              direction="row"
              gap="1"
              height="8"
              justify="center"
            >
              {range(0, media.length).map((item) => (
                <View key={item} style={styles.page(item === index)} />
              ))}
            </View>
          ) : null}

          <IconButton
            icon="xmark"
            label=""
            onPress={() => {
              translate.set(
                withTiming(
                  frame.height,
                  {
                    duration: 100,
                  },
                  () => {
                    scheduleOnRN(call.end)
                  },
                ),
              )
            }}
            style={styles.close}
          />
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  )
})

const styles = StyleSheet.create((theme, runtime) => ({
  close: {
    position: 'absolute',
    right: 0,
  },
  controls: {
    left: theme.space[4],
    position: 'absolute',
    right: theme.space[4],
    top: theme.space[4] + runtime.insets.top,
  },
  main: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
  },
  page: (active: boolean) => ({
    backgroundColor: '#fff',
    borderRadius: theme.space[2],
    height: theme.space[2],
    opacity: active ? 1 : 0.25,
    width: theme.space[2],
  }),
}))
