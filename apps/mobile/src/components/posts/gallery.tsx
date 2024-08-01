import { Image } from 'expo-image'
import { ImageZoom } from 'expo-image-zoom'
import { useState } from 'react'
import {
  FlatList,
  Modal,
  type StyleProp,
  View,
  type ViewStyle,
} from 'react-native'
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from 'react-native-safe-area-context'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { getDimensions } from '~/lib/media'
import { type PostImage } from '~/types/post'

import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { HeaderButton } from '../navigation/header-button'

type Props = {
  images: Array<PostImage>
  margin?: number
  style?: StyleProp<ViewStyle>
}

export function PostGalleryCard({ images, margin = 0, style }: Props) {
  const frame = useSafeAreaFrame()
  const insets = useSafeAreaInsets()

  const t = useTranslations('component.posts.gallery')

  const { styles } = useStyles(stylesheet)

  const frameWidth = frame.width - margin

  const [visible, setVisible] = useState(false)
  const [current, setCurrent] = useState(0)

  const first = getDimensions(frameWidth, images[0])

  return (
    <>
      <Pressable
        onPress={() => {
          setVisible(true)
        }}
        style={style}
      >
        <Image
          source={images[current].url}
          style={[styles.image(first.height, first.width)]}
        />

        {images.length > 1 ? (
          <View style={styles.count}>
            <Text size="1" tabular>
              {t('items', {
                count: images.length,
              })}
            </Text>
          </View>
        ) : null}
      </Pressable>

      <Modal
        animationType="fade"
        onRequestClose={() => {
          setVisible(false)
        }}
        style={styles.modal}
        transparent
        visible={visible}
      >
        <FlatList
          data={images}
          decelerationRate="fast"
          getItemLayout={(items, index) => ({
            index,
            length: frame.width,
            offset: frame.width * index,
          })}
          horizontal
          initialScrollIndex={current}
          keyExtractor={(item) => item.url}
          onScroll={(event) => {
            const next = Math.round(
              event.nativeEvent.contentOffset.x / frameWidth,
            )

            setCurrent(next)
          }}
          renderItem={({ item }) => {
            const dimensions = getDimensions(frame.width, item)

            return (
              <Pressable
                onPress={() => {
                  setVisible(false)
                }}
                style={styles.item(dimensions.height, dimensions.width)}
              >
                <ImageZoom
                  source={item.url}
                  style={styles.image(dimensions.height, dimensions.width)}
                />
              </Pressable>
            )
          }}
          showsHorizontalScrollIndicator={false}
          snapToOffsets={images.map((image, index) => frameWidth * index)}
          style={styles.list(frame.height, frame.width)}
        />

        <HeaderButton
          icon="X"
          onPress={() => {
            setVisible(false)
          }}
          style={styles.header(insets.top)}
        />

        <View style={styles.footer(insets.bottom)}>
          <Text size="1" tabular>
            {t('item', {
              count: images.length,
              current: current + 1,
            })}
          </Text>
        </View>
      </Modal>
    </>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  count: {
    backgroundColor: theme.colors.black.a9,
    borderRadius: theme.radius[2],
    bottom: theme.space[2],
    paddingHorizontal: theme.space[1],
    paddingVertical: theme.space[1] / 2,
    position: 'absolute',
    right: theme.space[2],
  },
  footer: (inset: number) => ({
    alignSelf: 'center',
    backgroundColor: theme.colors.gray.a3,
    borderRadius: theme.radius[2],
    bottom: inset + theme.space[2],
    paddingHorizontal: theme.space[1],
    paddingVertical: theme.space[1] / 2,
    position: 'absolute',
  }),
  header: (inset: number) => ({
    position: 'absolute',
    right: 0,
    top: inset,
  }),
  image: (height: number, width: number) => ({
    backgroundColor: theme.colors.gray.a3,
    height,
    width,
  }),
  item: (height: number, width: number) => ({
    alignSelf: 'center',
    backgroundColor: theme.colors.gray.a3,
    height,
    width,
  }),
  list: (height: number, width: number) => ({
    backgroundColor: theme.colors.gray[1],
    height,
    width,
  }),
  modal: {
    flex: 1,
  },
}))
