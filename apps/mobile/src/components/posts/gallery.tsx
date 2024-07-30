import { Image } from 'expo-image'
import { useState } from 'react'
import { type StyleProp, View, type ViewStyle } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaFrame } from 'react-native-safe-area-context'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { getDimensions } from '~/lib/media'
import { type PostImage } from '~/types/post'

import { Text } from '../common/text'

type Props = {
  images: Array<PostImage>
  style?: StyleProp<ViewStyle>
}

export function PostGalleryCard({ images, style }: Props) {
  const frame = useSafeAreaFrame()

  const t = useTranslations('component.posts.gallery')

  const { styles } = useStyles(stylesheet)

  const height = useSharedValue(getDimensions(frame.width, images[0]).height)

  const [current, setCurrent] = useState(0)

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
  }))

  return (
    <View style={style}>
      <Animated.FlatList
        data={images}
        decelerationRate="fast"
        horizontal
        keyExtractor={(item) => item.url}
        onScroll={(event) => {
          const next = Math.round(
            event.nativeEvent.contentOffset.x / frame.width,
          )

          setCurrent(next)

          if (images[next]) {
            const nextHeight = getDimensions(frame.width, images[next]).height

            height.value = withTiming(nextHeight, {
              duration: 150,
            })
          }
        }}
        renderItem={({ item }) => {
          const dimensions = getDimensions(frame.width, item)

          return <Image source={item.url} style={dimensions} />
        }}
        showsHorizontalScrollIndicator={false}
        snapToOffsets={images.map((image, index) => frame.width * index)}
        style={[styles.main(frame.width), animatedStyle]}
      />

      <View style={styles.footer}>
        <Text size="1" tabular>
          {t('item', {
            current: current + 1,
            total: images.length,
          })}
        </Text>
      </View>
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  footer: {
    backgroundColor: theme.colors.black.a9,
    borderRadius: theme.space[1],
    bottom: theme.space[2],
    flexDirection: 'row',
    paddingHorizontal: theme.space[1],
    paddingVertical: theme.space[1] / 2,
    position: 'absolute',
    right: theme.space[2],
  },
  main: (frame: number) => ({
    backgroundColor: theme.colors.gray.a3,
    width: frame,
  }),
}))
