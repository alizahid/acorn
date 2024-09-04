import { BlurView } from 'expo-blur'
import { Image } from 'expo-image'
import * as StatusBar from 'expo-status-bar'
import { useRef, useState } from 'react'
import { FlatList, type StyleProp, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { useCommon } from '~/hooks/common'
import { useImagePlaceholder } from '~/hooks/image'
import { getDimensions } from '~/lib/media'
import { usePreferences } from '~/stores/preferences'
import { type PostMedia } from '~/types/post'

import { FakeModal } from '../../common/fake-modal'
import { Icon } from '../../common/icon'
import { Pressable } from '../../common/pressable'
import { Text } from '../../common/text'
import { View } from '../../common/view'
import { GalleryImage } from './image'

type Props = {
  images: Array<PostMedia>
  margin?: number
  maxHeight?: number
  nsfw?: boolean
  recyclingKey?: string
  style?: StyleProp<ViewStyle>
}

export function PostGalleryCard({
  images,
  margin = 0,
  maxHeight,
  nsfw,
  recyclingKey,
  style,
}: Props) {
  const common = useCommon()

  const t = useTranslations('component.posts.gallery')

  const { styles, theme } = useStyles(stylesheet)

  const placeholder = useImagePlaceholder()
  const { blurNsfw } = usePreferences()

  const list = useRef<FlatList<PostMedia>>(null)

  const [visible, setVisible] = useState(false)
  const [initial, setInitial] = useState(0)

  const frameWidth = common.frame.width - margin

  const dimensions = getDimensions(
    frameWidth,
    images[0] ?? {
      height: 0,
      width: 0,
    },
  )

  return (
    <>
      <View style={style}>
        <FlatList
          data={images}
          decelerationRate="fast"
          getItemLayout={(item, index) => ({
            index,
            length: frameWidth,
            offset: frameWidth * index,
          })}
          horizontal
          initialNumToRender={3}
          keyExtractor={(item, index) => String(index)}
          ref={list}
          renderItem={({ index, item }) => (
            <Pressable
              onPress={() => {
                setInitial(index)

                setVisible(true)
              }}
              style={styles.main(
                maxHeight ?? common.height.max,
                dimensions.height,
                dimensions.width,
              )}
            >
              <Image
                {...placeholder}
                contentFit="cover"
                recyclingKey={recyclingKey}
                source={item.thumbnail ?? item.url}
                style={styles.image}
              />

              {item.type === 'gif' ? (
                <View style={[styles.label, styles.gif]}>
                  <Text contrast size="1">
                    {t('gif')}
                  </Text>
                </View>
              ) : null}
            </Pressable>
          )}
          scrollEnabled={images.length > 1}
          showsHorizontalScrollIndicator={false}
          snapToOffsets={images.map((image, index) => frameWidth * index)}
        />

        {nsfw && blurNsfw ? (
          <BlurView
            intensity={100}
            pointerEvents="none"
            style={[
              styles.main(
                maxHeight ?? common.height.max,
                dimensions.height,
                dimensions.width,
              ),
              styles.blur,
            ]}
          >
            <Icon
              color={theme.colors.gray.a12}
              name="Warning"
              size={theme.space[6]}
              weight="fill"
            />

            <Text weight="medium">{t('nsfw')}</Text>
          </BlurView>
        ) : null}

        {images.length > 1 ? (
          <View style={[styles.label, styles.count]}>
            <Text contrast size="1" tabular>
              {t('items', {
                count: images.length,
              })}
            </Text>
          </View>
        ) : null}
      </View>

      <FakeModal
        close
        onClose={() => {
          setVisible(false)

          StatusBar.setStatusBarHidden(false, 'fade')
        }}
        visible={visible}
      >
        <FlatList
          data={images}
          decelerationRate="fast"
          getItemLayout={(item, index) => ({
            index,
            length: common.frame.width,
            offset: common.frame.width * index,
          })}
          horizontal
          initialNumToRender={3}
          initialScrollIndex={initial}
          keyExtractor={(item, index) => String(index)}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(
              event.nativeEvent.contentOffset.x / common.frame.width,
            )

            list.current?.scrollToIndex({
              animated: false,
              index,
            })
          }}
          renderItem={({ item }) => (
            <GalleryImage image={item} recyclingKey={recyclingKey} />
          )}
          scrollEnabled={images.length > 1}
          showsHorizontalScrollIndicator={false}
          snapToOffsets={images.map(
            (image, index) => common.frame.width * index,
          )}
        />
      </FakeModal>
    </>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  blur: {
    alignItems: 'center',
    gap: theme.space[4],
    justifyContent: 'center',
    position: 'absolute',
  },
  count: {
    right: theme.space[2],
  },
  gif: {
    left: theme.space[2],
  },
  image: {
    flex: 1,
  },
  label: {
    backgroundColor: theme.colors.black.a9,
    borderCurve: 'continuous',
    borderRadius: theme.radius[2],
    bottom: theme.space[2],
    paddingHorizontal: theme.space[1],
    paddingVertical: theme.space[1] / 2,
    position: 'absolute',
  },
  main: (maxHeight: number, height: number, width: number) => ({
    height: Math.min(maxHeight, height),
    width,
  }),
}))
