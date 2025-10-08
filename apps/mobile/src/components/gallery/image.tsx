import { Zoomable } from '@likashefqet/react-native-image-zoom'
import { Image, useImage } from 'expo-image'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { useCopyImage, useDownloadImage, useShareImage } from '~/hooks/image'
import { type PostMedia } from '~/types/post'

import { IconButton } from '../common/icon/button'
import { View } from '../common/view'

type Props = {
  item: PostMedia
}

export function GalleryImage({ item }: Props) {
  const a11y = useTranslations('a11y')

  const copy = useCopyImage()
  const download = useDownloadImage()
  const share = useShareImage()

  const image = useImage(item.url)

  return (
    <View style={styles.main}>
      <View style={styles.item(item.width, item.height)}>
        <Zoomable isDoubleTapEnabled>
          <Image
            accessibilityIgnoresInvertColors
            priority="high"
            recyclingKey={item.url}
            source={image ?? item.thumbnail}
            style={styles.image}
          />
        </Zoomable>
      </View>

      <View direction="row" justify="center" px="2" style={styles.controls}>
        <IconButton
          icon="square.on.square"
          label={a11y('copy')}
          loading={copy.isPending}
          onPress={() => {
            copy.copy({
              url: item.url,
            })
          }}
          weight="bold"
        />

        <IconButton
          icon="square.and.arrow.up"
          label={a11y('share')}
          loading={share.isPending}
          onPress={() => {
            share.share({
              url: item.url,
            })
          }}
          weight="bold"
        />

        <IconButton
          icon="square.and.arrow.down"
          label={a11y('download')}
          loading={download.isPending}
          onPress={() => {
            download.download({
              url: item.url,
            })
          }}
          weight="bold"
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create((theme, runtime) => ({
  controls: {
    alignSelf: 'center',
    backgroundColor: theme.colors.white.bgAltAlpha,
    borderCurve: 'continuous',
    borderRadius: theme.space[8],
    bottom: theme.space[4] + runtime.insets.bottom,
    position: 'absolute',
  },
  image: {
    backgroundColor: '#000',
    flex: 1,
  },
  item: (width: number, height: number) => {
    const widthRatio = runtime.screen.width / width
    const heightRatio = runtime.screen.height / height

    const scale = Math.min(widthRatio, heightRatio)

    return {
      alignSelf: 'center',
      height: height * scale,
      width: width * scale,
    }
  },
  main: {
    height: runtime.screen.height,
    justifyContent: 'center',
    width: runtime.screen.width,
  },
}))
