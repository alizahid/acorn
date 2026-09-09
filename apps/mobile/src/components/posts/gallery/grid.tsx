import { useRecyclingState } from '@shopify/flash-list'
import { Image } from 'expo-image'
import { useMemo, useRef, useState } from 'react'
import { View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { Gallery } from 'react-native-jet-gallery'
import { useSafeAreaFrame } from 'react-native-safe-area-context'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { useShallow } from 'zustand/react/shallow'

import { MediaMenu } from '~/components/common/media-menu'
import { Text } from '~/components/common/text'
import { useImageActions } from '~/hooks/image'
import { unlockOrientation } from '~/lib/orientation'
import { usePreferences } from '~/stores/preferences'
import { space } from '~/styles/tokens'
import { type PostMedia } from '~/types/post'

import { GalleryBlur } from './blur'
import { More } from './more'

type Props = {
  images: Array<PostMedia>
  nsfw?: boolean
  onDismiss?: () => void
  recyclingKey?: string
  spoiler?: boolean
}

export function ImageGrid({
  images,
  nsfw = false,
  onDismiss,
  recyclingKey,
  spoiler = false,
}: Props) {
  const frame = useSafeAreaFrame()

  const t = useTranslations('component.posts.gallery')

  const list = useRef<FlatList<PostMedia>>(null)

  useRecyclingState(recyclingKey, [recyclingKey], () => {
    list.current?.scrollToOffset({
      animated: false,
      offset: 0,
    })
  })

  const { blurNsfw, blurSpoiler } = usePreferences(
    useShallow((state) => ({
      blurNsfw: state.blurNsfw,
      blurSpoiler: state.blurSpoiler,
    })),
  )

  const { actions } = useImageActions()

  const [width, setWidth] = useState(frame.width)

  const data = useMemo(() => {
    const ratios = images.map((image) => image.width / image.height)

    const height = Math.min(
      frame.height * 0.5,
      Math.round(width / Math.max(...ratios)),
    )

    const sizes = ratios.map((ratio) => ({
      height,
      width: Math.round(ratio * height),
    }))

    const offsets = sizes.map((_, index) =>
      sizes
        .slice(0, index)
        .reduce((total, size) => total + size.width + space[3], 0),
    )

    return {
      height,
      offsets,
      sizes,
    }
  }, [images, frame.height, width])

  if (images.length === 1) {
    const [image] = images

    if (!image) {
      return null
    }

    const height = Math.round(width / (image.width / image.height))

    const more = height > frame.height * 0.5

    return (
      <Gallery
        actions={actions}
        images={[image]}
        onDismiss={onDismiss}
        onShow={() => {
          unlockOrientation()
        }}
      >
        <Gallery.Image
          index={0}
          onLongPress={(event) => {
            MediaMenu.call({
              type: 'image',
              url: event.url,
            })
          }}
          style={[styles.image, styles.one(image.width / image.height)]}
        >
          <Image
            accessibilityIgnoresInvertColors
            recyclingKey={recyclingKey}
            source={image.url}
            style={styles.single}
          />
        </Gallery.Image>

        {(nsfw && blurNsfw) || (spoiler && blurSpoiler) ? (
          <GalleryBlur label={t(spoiler ? 'spoiler' : 'nsfw')} />
        ) : null}

        {image.type === 'gif' ? (
          <View pointerEvents="none" style={[styles.label, styles.gif]}>
            <Text contrast size="1" weight="medium">
              {t('gif')}
            </Text>
          </View>
        ) : null}

        {more ? <More /> : null}
      </Gallery>
    )
  }

  return (
    <>
      <Gallery
        actions={actions}
        images={images}
        onDismiss={onDismiss}
        onShow={() => {
          unlockOrientation()
        }}
      >
        <FlatList
          contentContainerStyle={styles.carousel(data.height)}
          data={images}
          decelerationRate="fast"
          horizontal
          keyExtractor={(item) => item.url}
          onLayout={(event) => {
            setWidth(event.nativeEvent.layout.width)
          }}
          ref={list}
          renderItem={({ index, item }) => (
            <>
              <Gallery.Image
                index={index}
                onLongPress={(event) => {
                  MediaMenu.call({
                    type: 'image',
                    url: event.url,
                  })
                }}
                style={styles.image}
              >
                <Image
                  accessibilityIgnoresInvertColors
                  recyclingKey={recyclingKey}
                  source={item.url}
                  style={data.sizes[index]}
                />
              </Gallery.Image>

              {(nsfw && blurNsfw) || (spoiler && blurSpoiler) ? (
                <GalleryBlur label={t(spoiler ? 'spoiler' : 'nsfw')} />
              ) : null}

              {item.type === 'gif' ? (
                <View pointerEvents="none" style={[styles.label, styles.gif]}>
                  <Text contrast size="1" weight="medium">
                    {t('gif')}
                  </Text>
                </View>
              ) : null}
            </>
          )}
          scrollEnabled={images.length > 1}
          showsHorizontalScrollIndicator={false}
          snapToOffsets={data.offsets}
        />
      </Gallery>

      <View pointerEvents="none" style={[styles.label, styles.count]}>
        <Text contrast size="1" weight="medium">
          {t('items', {
            count: images.length,
          })}
        </Text>
      </View>
    </>
  )
}

const styles = StyleSheet.create((theme) => ({
  carousel: (height: number) => ({
    flexGrow: 1,
    gap: theme.space[3],
    height,
  }),
  count: {
    right: theme.space[2],
  },
  gif: {
    left: theme.space[2],
  },
  image: {
    borderCurve: 'continuous',
    borderRadius: theme.radius[4],
    overflow: 'hidden',
  },
  label: {
    backgroundColor: theme.colors.black.accentAlpha,
    borderCurve: 'continuous',
    borderRadius: theme.radius[2],
    bottom: theme.space[2],
    paddingHorizontal: theme.space[1],
    paddingVertical: theme.space[1] / 2,
    position: 'absolute',
  },
  one: (aspectRatio: number) => ({
    aspectRatio,
  }),
  single: {
    flex: 1,
  },
}))
