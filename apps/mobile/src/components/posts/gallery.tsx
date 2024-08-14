import { BlurView } from 'expo-blur'
import { Image } from 'expo-image'
import * as StatusBar from 'expo-status-bar'
import { useState } from 'react'
import { FlatList, type StyleProp, View, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { useCommon } from '~/hooks/common'
import { useImagePlaceholder } from '~/hooks/image'
import { getDimensions } from '~/lib/media'
import { usePreferences } from '~/stores/preferences'
import { type Post, type PostMedia } from '~/types/post'

import { FakeModal } from '../common/fake-modal'
import { Icon } from '../common/icon'
import { ImageZoom } from '../common/image-zoom'
import { Pressable } from '../common/pressable'
import { Text } from '../common/text'

type Props = {
  images: Array<PostMedia>
  margin?: number
  post: Post
  recyclingKey?: string
  style?: StyleProp<ViewStyle>
}

export function PostGalleryCard({
  images,
  margin = 0,
  post,
  recyclingKey,
  style,
}: Props) {
  const common = useCommon()

  const t = useTranslations('component.posts.gallery')

  const { styles, theme } = useStyles(stylesheet)

  const { nsfw } = usePreferences()
  const placeholder = useImagePlaceholder()

  const [visible, setVisible] = useState(false)

  const frameWidth = common.frame.width - margin

  const first = images[0]

  const firstDimensions = getDimensions(
    frameWidth,
    first ?? {
      height: 0,
      width: 0,
    },
  )

  return (
    <>
      {first ? (
        <Pressable
          onPress={() => {
            setVisible(true)
          }}
          style={style}
          without
        >
          <Image
            {...placeholder}
            contentFit="cover"
            recyclingKey={recyclingKey}
            source={first.thumbnail ?? first.url}
            style={[
              styles.main(
                common.height.max,
                firstDimensions.height,
                firstDimensions.width,
              ),
            ]}
          />

          {post.nsfw && !nsfw ? (
            <BlurView
              intensity={100}
              pointerEvents="none"
              style={[
                styles.main(
                  common.height.max,
                  firstDimensions.height,
                  firstDimensions.width,
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

          {first.type === 'gif' ? (
            <View style={[styles.label, styles.gif]}>
              <Text contrast size="1">
                {t('gif')}
              </Text>
            </View>
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
        </Pressable>
      ) : null}

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
          disableScrollViewPanResponder
          horizontal
          initialNumToRender={3}
          keyExtractor={(item, index) => String(index)}
          renderItem={({ item }) => {
            const dimensions = getDimensions(common.frame.width, item)

            return (
              <ImageZoom
                recyclingKey={recyclingKey}
                source={item.url}
                style={styles.image(
                  common.frame.height,
                  dimensions.height,
                  dimensions.width,
                )}
              />
            )
          }}
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
  image: (maxHeight: number, height: number, width: number) => ({
    alignSelf: 'center',
    height,
    maxHeight,
    width,
  }),
  label: {
    backgroundColor: theme.colors.black.a9,
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
