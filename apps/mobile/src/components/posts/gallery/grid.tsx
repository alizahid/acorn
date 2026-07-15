import { Galeria } from '@nandorojo/galeria'
import { Image } from 'expo-image'
import { useMemo, useState } from 'react'
import { View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { InView } from '~/components/common/in-view'
import { Text } from '~/components/common/text'
import { iPad } from '~/lib/common'
import { type PostMedia } from '~/types/post'

import { GalleryBlur } from './blur'

type Props = {
  images: Array<PostMedia>
  nsfw?: boolean
  onDismiss?: () => void
  onLongPress?: () => void
  recyclingKey?: string
  spoiler?: boolean
}

export function ImageGrid({
  images,
  nsfw = false,
  onDismiss,
  onLongPress,
  recyclingKey,
  spoiler = false,
}: Props) {
  const t = useTranslations('component.posts.gallery')

  styles.useVariants({
    iPad,
  })

  const [visible, setVisible] = useState(false)

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
      <InView onChange={setVisible}>
        <Galeria closeIconName="xmark" urls={[image.url]}>
          <View style={styles.one(image.width / image.height)}>
            <Galeria.Image onDismiss={onDismiss} onLongPress={onLongPress}>
              <Image
                accessibilityIgnoresInvertColors
                priority={visible ? 'high' : 'low'}
                recyclingKey={recyclingKey}
                source={image.thumbnail}
                style={styles.image}
              />
            </Galeria.Image>

            {nsfw || spoiler ? (
              <GalleryBlur label={t(spoiler ? 'spoiler' : 'nsfw')} />
            ) : null}

            {image.type === 'gif' ? (
              <View style={[styles.label, styles.gif]}>
                <Text contrast size="1" weight="medium">
                  {t('gif')}
                </Text>
              </View>
            ) : null}
          </View>
        </Galeria>
      </InView>
    )
  }

  return (
    <InView onChange={setVisible}>
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
                onLongPress={onLongPress}
              >
                <Image
                  priority={visible ? 'high' : 'low'}
                  source={item.thumbnail ?? item.url}
                  style={[styles.slide, data.sizes[index]]}
                />
              </Galeria.Image>

              {item.type === 'gif' ? (
                <View style={[styles.label, styles.gif]}>
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

      {nsfw || spoiler ? (
        <GalleryBlur label={t(spoiler ? 'spoiler' : 'nsfw')} />
      ) : null}
    </InView>
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
  more: {
    ...StyleSheet.absoluteFill,
    backgroundColor: theme.colors.black.accentAlpha,
  },
  one: (aspectRatio: number) => ({
    aspectRatio,
  }),
  slide: {
    borderCurve: 'continuous',
    borderRadius: theme.radius[4],
  },
}))
