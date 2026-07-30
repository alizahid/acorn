import { Image } from 'expo-image'
import { useMemo, useState } from 'react'
import { View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { Gallery } from 'react-native-jet-gallery'
import { StyleSheet, useUnistyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { useShallow } from 'zustand/react/shallow'

import { MediaMenu } from '~/components/common/media-menu'
import { Text } from '~/components/common/text'
import { useImageActions } from '~/hooks/image'
import { usePreferences } from '~/stores/preferences'
import { space } from '~/styles/tokens'
import { type PostMedia } from '~/types/post'

import { GalleryBlur } from './blur'

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
  const t = useTranslations('component.posts.gallery')

  const { rt } = useUnistyles()

  const { blurNsfw, blurSpoiler } = usePreferences(
    useShallow((state) => ({
      blurNsfw: state.blurNsfw,
      blurSpoiler: state.blurSpoiler,
    })),
  )

  const { actions } = useImageActions()

  const [width, setWidth] = useState(rt.screen.width)

  const data = useMemo(() => {
    const ratios = images.map((image) => image.width / image.height)

    const height = Math.min(
      rt.screen.height * 0.4,
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
  }, [images, rt.screen.height, width])

  if (images.length === 1) {
    const image = images[0]!

    return (
      <Gallery actions={actions} images={[image]} onDismiss={onDismiss}>
        <Gallery.Image
          index={0}
          onLongPress={(event) => {
            console.log('foo')

            MediaMenu.call({
              type: 'image',
              url: event.url,
            })
          }}
          style={styles.one(image.width / image.height)}
        >
          <Image
            accessibilityIgnoresInvertColors
            recyclingKey={recyclingKey}
            source={image.url}
            style={styles.image}
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
      </Gallery>
    )
  }

  return (
    <>
      <Gallery actions={actions} images={images} onDismiss={onDismiss}>
        <FlatList
          contentContainerStyle={styles.carousel(data.height)}
          data={images}
          decelerationRate="fast"
          horizontal
          keyExtractor={(item) => item.url}
          onLayout={(event) => {
            setWidth(event.nativeEvent.layout.width)
          }}
          renderItem={({ index, item }) => (
            <>
              <Gallery.Image
                index={index}
                onLongPress={(event) => {
                  console.log('foo')

                  MediaMenu.call({
                    type: 'image',
                    url: event.url,
                  })
                }}
              >
                <Image
                  accessibilityIgnoresInvertColors
                  recyclingKey={recyclingKey}
                  source={item.url}
                  style={[styles.slide, data.sizes[index]]}
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
    height: '100%',
    width: '100%',
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
  slide: {
    borderCurve: 'continuous',
    borderRadius: theme.radius[4],
  },
}))
