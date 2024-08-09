import { Zoomable } from '@likashefqet/react-native-image-zoom'
import { Image } from 'expo-image'
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

  const { styles, theme } = useStyles(stylesheet)

  const [visible, setVisible] = useState(false)

  const frameWidth = common.frame.width - margin
  const maxHeight =
    common.frame.height -
    common.headerHeight -
    common.tabBarHeight -
    theme.space[9]

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
        >
          <Image
            contentFit="cover"
            recyclingKey={recyclingKey}
            source={first.url}
            style={[
              styles.main(maxHeight, dimensions.height, dimensions.width),
            ]}
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
      ) : null}

      <FakeModal
        onClose={() => {
          setVisible(false)
        }}
        visible={visible}
      >
        <FlatList
          contentContainerStyle={styles.content(
            common.insets.top,
            common.insets.bottom,
          )}
          data={images}
          decelerationRate="fast"
          horizontal
          keyExtractor={(item, index) => String(index)}
          renderItem={({ item }) => (
            <Zoomable isDoubleTapEnabled>
              <Image
                contentFit="contain"
                recyclingKey={recyclingKey}
                source={item.url}
                style={styles.image(
                  common.frame.height -
                    common.insets.top -
                    common.insets.bottom,
                  common.frame.width,
                )}
              />
            </Zoomable>
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
  main: (maxHeight: number, height: number, width: number) => ({
    backgroundColor: theme.colors.gray.a2,
    height: Math.min(maxHeight, height),
    width,
  }),
}))
