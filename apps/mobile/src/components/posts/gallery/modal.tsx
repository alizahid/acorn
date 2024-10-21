import * as StatusBar from 'expo-status-bar'
import { useCallback, useState } from 'react'
import { Modal } from 'react-native'
import Gallery from 'react-native-awesome-gallery'
import Animated, {
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

  const opacity = useSharedValue(1)

  const download = useDownloadImage()
  const copy = useCopyImage()

  const [hidden, setHidden] = useState(false)
  const [viewing, setViewing] = useState<PostMedia>()

  const style = useAnimatedStyle(() => ({
    opacity: opacity.get(),
  }))

  const close = useCallback(() => {
    onClose()

    StatusBar.setStatusBarHidden(false, 'fade')

    opacity.set(() => withTiming(1))

    setHidden(false)
  }, [onClose, opacity])

  const first = images[0]

  if (!first) {
    return null
  }

  return (
    <Modal animationType="fade" transparent visible={visible}>
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

      <Animated.View pointerEvents="box-none" style={[styles.header, style]}>
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
            if (!viewing) {
              return
            }

            download.download({
              url: viewing.url,
            })
          }}
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
        />
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
    bottom: theme.space[4] + runtime.insets.bottom,
    flexDirection: 'row',
    gap: theme.space[2],
    justifyContent: 'center',
    left: theme.space[4],
    position: 'absolute',
    right: theme.space[4],
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
}))
