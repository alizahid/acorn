import { Image } from 'expo-image'
import * as StatusBar from 'expo-status-bar'
import { useState } from 'react'
import { FlatList, type StyleProp, View, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { useCommon } from '~/hooks/common'
import { getDimensions } from '~/lib/media'
import { type PostMedia } from '~/types/post'

import { FakeModal } from '../common/fake-modal'
import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { Zoom } from '../common/zoom'

type Props = {
  images: Array<PostMedia>
  margin?: number
  recyclingKey?: string
  style?: StyleProp<ViewStyle>
}

export function PostGalleryCard({
  images,
  margin = 0,
  recyclingKey,
  style,
}: Props) {
  const common = useCommon()

  const t = useTranslations('component.posts.gallery')

  const { styles } = useStyles(stylesheet)

  const [visible, setVisible] = useState(false)

  const frameWidth = common.frame.width - margin

  const first = images[0]

  const dimensions = getDimensions(
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
            contentFit="cover"
            recyclingKey={recyclingKey}
            source={first.thumbnail ?? first.url}
            style={[
              styles.main(
                common.height.max,
                dimensions.height,
                dimensions.width,
              ),
            ]}
          />

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
        onClose={() => {
          setVisible(false)

          StatusBar.setStatusBarHidden(false, 'fade')
        }}
        visible={visible}
      >
        <FlatList
          data={images}
          decelerationRate="fast"
          horizontal
          keyExtractor={(item, index) => String(index)}
          renderItem={({ item }) => (
            <Zoom>
              <Image
                contentFit="contain"
                recyclingKey={recyclingKey}
                source={item.url}
                style={styles.image(common.frame.height, common.frame.width)}
              />
            </Zoom>
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
  count: {
    right: theme.space[2],
  },
  gif: {
    left: theme.space[2],
  },
  image: (height: number, width: number) => ({
    height,
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
