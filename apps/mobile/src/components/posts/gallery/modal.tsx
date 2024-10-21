import * as StatusBar from 'expo-status-bar'
import { useCallback, useEffect, useState } from 'react'
import { Modal } from 'react-native'
import Gallery from 'react-native-awesome-gallery'
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { HeaderButton } from '~/components/navigation/header-button'
import { useCopyImage, useDownloadImage } from '~/hooks/image'
import { type PostMedia } from '~/types/post'

import { Text } from '../../common/text'
import { View } from '../../common/view'
import { GalleryImage } from './image'

type Props = {
  images: Array<PostMedia>
  onClose: () => void
  recyclingKey?: string
  visible: boolean
}

export function PostGalleryModal({
  images,
  onClose,
  recyclingKey,
  visible,
}: Props) {
  const t = useTranslations('component.posts.gallery')

  const { styles, theme } = useStyles(stylesheet)

  const modal = useSharedValue(0)
  const opacity = useSharedValue(1)

  const download = useDownloadImage()
  const copy = useCopyImage()

  const [hidden, setHidden] = useState(false)
  const [viewing, setViewing] = useState<PostMedia>()

  const modalStyle = useAnimatedStyle(() => ({
    opacity: modal.get(),
  }))

  useEffect(() => {
    modal.set(() => withTiming(visible ? 1 : 0))
  }, [modal, visible])

  const controlStyle = useAnimatedStyle(() => ({
    opacity: opacity.get(),
  }))

  const close = useCallback(() => {
    modal.set(() =>
      withTiming(0, undefined, () => {
        runOnJS(onClose)()
      }),
    )

    StatusBar.setStatusBarHidden(false, 'fade')

    opacity.set(() => withTiming(1))

    setHidden(false)
  }, [modal, onClose, opacity])

  const first = images[0]

  if (!first) {
    return null
  }

  return (
    <Modal transparent visible={visible}>
      <Animated.View style={[styles.modal, modalStyle]}>
        <Gallery
          data={images}
          emptySpaceWidth={theme.space[6]}
          keyExtractor={(item) => item.url}
          loop
          onIndexChange={(index) => {
            setViewing(images[index])
          }}
          onSwipeToClose={() => {
            close()
          }}
          onTap={() => {
            const next = !hidden

            StatusBar.setStatusBarHidden(next, 'fade')

            opacity.set(() => withTiming(next ? 0 : 1))

            setHidden(next)
          }}
          renderItem={({ item, setImageDimensions }) => {
            setImageDimensions(item)

            return <GalleryImage image={item} recyclingKey={recyclingKey} />
          }}
          style={styles.main}
        />

        <Animated.View
          pointerEvents="box-none"
          style={[styles.header, controlStyle]}
        >
          {images.length > 1 ? (
            <View style={styles.label}>
              <Text contrast size="1" tabular>
                {t('item', {
                  count: images.length,
                  current: (viewing ? images.indexOf(viewing) : 0) + 1,
                })}
              </Text>
            </View>
          ) : null}

          <HeaderButton
            icon="X"
            onPress={() => {
              close()
            }}
            style={styles.close}
            weight="bold"
          />
        </Animated.View>

        <Animated.View
          pointerEvents="box-none"
          style={[styles.footer, controlStyle]}
        >
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
              if (!viewing) {
                return
              }

              download.download({
                url: viewing.url,
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
              if (!viewing) {
                return
              }

              copy.copy({
                url: viewing.url,
              })
            }}
            weight={copy.isError ? 'fill' : copy.isSuccess ? 'fill' : 'duotone'}
          />
        </Animated.View>
      </Animated.View>
    </Modal>
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  close: {
    marginLeft: 'auto',
  },
  controls: (aspectRatio: number) => ({
    aspectRatio,
    marginVertical: 'auto',
  }),
  footer: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: theme.colors.black.a9,
    borderCurve: 'continuous',
    borderRadius: theme.space[9],
    bottom: theme.space[9] + runtime.insets.bottom,
    flexDirection: 'row',
    justifyContent: 'center',
    overflow: 'hidden',
    paddingHorizontal: theme.space[2],
    position: 'absolute',
  },
  gif: {
    bottom: theme.space[2],
    left: theme.space[2],
    position: 'absolute',
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: theme.space[4],
    position: 'absolute',
    right: theme.space[4],
    top: theme.space[4] + runtime.insets.top,
  },
  image: {
    flex: 1,
  },
  label: {
    backgroundColor: theme.colors.black.a9,
    borderCurve: 'continuous',
    borderRadius: theme.radius[2],
    paddingHorizontal: theme.space[1],
    paddingVertical: theme.space[1] / 2,
  },
  main: {
    backgroundColor: theme.colors.gray[1],
  },
  modal: {
    flex: 1,
  },
}))
