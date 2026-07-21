import { Galeria } from '@nandorojo/galeria'
import { Image } from 'expo-image'
import { useMemo } from 'react'
import { View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { useShallow } from 'zustand/react/shallow'

import { Gallery } from '~/components/common/gallery'
import { Text } from '~/components/common/text'
import { iPad } from '~/lib/common'
import { usePreferences } from '~/stores/preferences'
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

  styles.useVariants({
    iPad,
  })

  const { blurNsfw, blurSpoiler } = usePreferences(
    useShallow((state) => ({
      blurNsfw: state.blurNsfw,
      blurSpoiler: state.blurSpoiler,
    })),
  )

  const data = useMemo(() => {
    const sizes = images.map((image) => ({
      height: styles.carousel.height,
      width: Math.round((image.width / image.height) * styles.carousel.height),
    }))

    const offsets = sizes.map((_, index) =>
      sizes
        .slice(0, index)
        .reduce((total, size) => total + size.width + styles.carousel.gap, 0),
    )

    return {
      offsets,
      sizes,
    }
  }, [images])

  if (images.length === 1) {
    const image = images[0]!

    return (
      <Galeria closeIconName="xmark" urls={[image.url]}>
        <View style={styles.one(image.width / image.height)}>
          <Galeria.Image
            onDismiss={onDismiss}
            onLongPress={() => {
              Gallery.call({
                type: 'image',
                url: image.url,
              })
            }}
          >
            <Image
              accessibilityIgnoresInvertColors
              recyclingKey={recyclingKey}
              source={image.url}
              style={styles.image}
            />
          </Galeria.Image>

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
        </View>
      </Galeria>
    )
  }

  return (
    <>
      <Galeria closeIconName="xmark" urls={images.map((image) => image.url)}>
        <FlatList
          contentContainerStyle={styles.carousel}
          data={images}
          decelerationRate="fast"
          horizontal
          keyExtractor={(item) => item.url}
          renderItem={({ index, item }) => (
            <View>
              <Galeria.Image
                index={index}
                onDismiss={onDismiss}
                onLongPress={() => {
                  Gallery.call({
                    type: 'image',
                    url: item.url,
                  })
                }}
              >
                <Image
                  source={item.url}
                  style={[styles.slide, data.sizes[index]]}
                />
              </Galeria.Image>

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
            </View>
          )}
          showsHorizontalScrollIndicator={false}
          snapToOffsets={data.offsets}
        />
      </Galeria>

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
  carousel: {
    gap: 16,
    variants: {
      iPad: {
        false: {
          height: 300,
        },
        true: {
          height: 400,
        },
      },
    },
  },
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
