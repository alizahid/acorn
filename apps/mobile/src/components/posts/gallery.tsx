import { Image } from 'expo-image'
import { ImageZoom } from 'expo-image-zoom'
import { useState } from 'react'
import { FlatList, type StyleProp, View, type ViewStyle } from 'react-native'
import Animated from 'react-native-reanimated'
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from 'react-native-safe-area-context'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { getDimensions } from '~/lib/media'
import { type PostMedia } from '~/types/post'

import { FakeModal } from '../common/fake-modal'
import { Pressable } from '../common/pressable'
import { Text } from '../common/text'

const AnimatedImage = Animated.createAnimatedComponent(Image)

type Props = {
  images: Array<PostMedia>
  margin?: number
  style?: StyleProp<ViewStyle>
}

export function PostGalleryCard({ images, margin = 0, style }: Props) {
  const frame = useSafeAreaFrame()
  const insets = useSafeAreaInsets()

  const t = useTranslations('component.posts.gallery')

  const { styles } = useStyles(stylesheet)

  const [visible, setVisible] = useState(false)

  const frameWidth = frame.width - margin

  const dimensions = getDimensions(frameWidth, images[0])

  return (
    <>
      <Pressable
        onPress={() => {
          setVisible(true)
        }}
        style={style}
      >
        <AnimatedImage
          source={images[0].url}
          style={[styles.image(dimensions.height, dimensions.width)]}
        />

        {images.length > 1 ? (
          <View style={styles.count}>
            <Text contrast size="1" tabular>
              {t('items', {
                count: images.length,
              })}
            </Text>
          </View>
        ) : null}
      </Pressable>

      <FakeModal
        onClose={() => {
          setVisible(false)
        }}
        visible={visible}
      >
        <FlatList
          contentContainerStyle={styles.content(insets.top, insets.bottom)}
          data={images}
          decelerationRate="fast"
          horizontal
          keyExtractor={(item) => item.url}
          renderItem={({ item }) => {
            return (
              <ImageZoom
                source={item.url}
                style={styles.image(
                  frame.height - insets.top - insets.bottom,
                  frame.width,
                )}
              />
            )
          }}
          showsHorizontalScrollIndicator={false}
          snapToOffsets={images.map((image, index) => frame.width * index)}
        />
      </FakeModal>
    </>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  content: (top: number, bottom: number) => ({
    paddingBottom: bottom,
    paddingTop: top,
  }),
  count: {
    backgroundColor: theme.colors.black.a9,
    borderRadius: theme.radius[2],
    bottom: theme.space[2],
    paddingHorizontal: theme.space[1],
    paddingVertical: theme.space[1] / 2,
    position: 'absolute',
    right: theme.space[2],
  },
  image: (height: number, width: number) => ({
    height,
    width,
  }),
}))
