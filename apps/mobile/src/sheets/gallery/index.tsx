import * as StatusBar from 'expo-status-bar'
import { useCallback, useState } from 'react'
import { createCallable } from 'react-call'
import { Modal } from 'react-native'
import AwesomeGallery from 'react-native-awesome-gallery'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Text } from '~/components/common/text'
import { HeaderButton } from '~/components/navigation/header-button'
import { useCopyImage, useDownloadImage } from '~/hooks/image'
import { usePreferences } from '~/stores/preferences'
import { oledTheme } from '~/styles/oled'
import { type PostMedia } from '~/types/post'

import { GalleryItem } from './item'

type Props = {
  images: Array<PostMedia>
  initial?: number
}

export const Gallery = createCallable<Props>(({ call, images, initial }) => {
  const t = useTranslations('component.posts.gallery')

  const { themeOled, themeTint } = usePreferences()

  const { styles, theme } = useStyles(stylesheet)

  const download = useDownloadImage()
  const copy = useCopyImage()

  const opacity = useSharedValue(1)

  const style = useAnimatedStyle(() => ({
    opacity: opacity.get(),
  }))

  const [index, setIndex] = useState(initial ?? 0)

  const onClose = useCallback(() => {
    call.end()

    StatusBar.setStatusBarHidden(false, 'fade')
  }, [call])

  const selected = images[index]

  return (
    <Modal animationType="fade" transparent visible>
      <AwesomeGallery
        data={images}
        emptySpaceWidth={theme.space[6]}
        initialIndex={initial}
        keyExtractor={(item) => item.url}
        numToRender={3}
        onIndexChange={setIndex}
        onSwipeToClose={() => {
          onClose()
        }}
        onTap={() => {
          const next = opacity.get() > 0 ? 0 : 1

          opacity.set(() => withTiming(next))

          StatusBar.setStatusBarHidden(!next, 'fade')
        }}
        renderItem={({ item, setImageDimensions }) => {
          setImageDimensions(item)

          return <GalleryItem image={item} />
        }}
        style={styles.main(themeOled, themeTint)}
      />

      {images.length > 1 ? (
        <Animated.View pointerEvents="none" style={[styles.pagination, style]}>
          <Text contrast size="1" tabular weight="medium">
            {t('item', {
              count: images.length,
              current: index + 1,
            })}
          </Text>
        </Animated.View>
      ) : null}

      <Animated.View pointerEvents="box-none" style={[styles.close, style]}>
        <HeaderButton
          icon="X"
          onPress={() => {
            onClose()
          }}
          weight="bold"
        />
      </Animated.View>

      {selected ? (
        <Animated.View pointerEvents="box-none" style={[styles.footer, style]}>
          <HeaderButton
            color={
              download.isError ? 'red' : download.isSuccess ? 'green' : 'accent'
            }
            icon={
              download.isError
                ? 'XCircle'
                : download.isSuccess
                  ? 'CheckCircle'
                  : 'Download'
            }
            loading={download.isPending}
            onPress={() => {
              download.download({
                url: selected.url,
              })
            }}
            weight={
              download.isError
                ? 'fill'
                : download.isSuccess
                  ? 'fill'
                  : 'duotone'
            }
          />

          <HeaderButton
            color={copy.isError ? 'red' : copy.isSuccess ? 'green' : 'accent'}
            icon={
              copy.isError ? 'XCircle' : copy.isSuccess ? 'CheckCircle' : 'Copy'
            }
            loading={copy.isPending}
            onPress={() => {
              copy.copy({
                url: selected.url,
              })
            }}
            weight={copy.isError ? 'fill' : copy.isSuccess ? 'fill' : 'duotone'}
          />
        </Animated.View>
      ) : null}
    </Modal>
  )
}, 250)

const stylesheet = createStyleSheet((theme, runtime) => ({
  close: {
    position: 'absolute',
    right: theme.space[4],
    top: theme.space[4] + runtime.insets.top,
  },
  footer: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: theme.colors.black.accentAlpha,
    borderCurve: 'continuous',
    borderRadius: theme.space[9],
    bottom: theme.space[9] + runtime.insets.bottom,
    flexDirection: 'row',
    justifyContent: 'center',
    overflow: 'hidden',
    paddingHorizontal: theme.space[2],
    position: 'absolute',
  },
  main: (oled: boolean, bg: boolean) => ({
    backgroundColor: oled
      ? oledTheme[theme.name].bg
      : theme.colors[bg ? 'accent' : 'gray'].ui,
  }),
  pagination: {
    alignSelf: 'center',
    backgroundColor: theme.colors.black.accentAlpha,
    borderCurve: 'continuous',
    borderRadius: theme.radius[2],
    paddingHorizontal: theme.space[1],
    paddingVertical: theme.space[1] / 2,
    position: 'absolute',
    top: theme.space[4] + runtime.insets.top,
  },
}))
