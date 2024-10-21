import * as StatusBar from 'expo-status-bar'
import { type VideoPlayer, VideoView } from 'expo-video'
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

import { HeaderButton } from '~/components/navigation/header-button'
import { type PostMedia } from '~/types/post'

import { VideoControls } from './controls'

type Props = {
  onClose: () => void
  player: VideoPlayer
  video: PostMedia
  visible: boolean
}

export function VideoModal({ onClose, player, video, visible }: Props) {
  const { styles } = useStyles(stylesheet)

  const modal = useSharedValue(0)
  const opacity = useSharedValue(1)

  const [hidden, setHidden] = useState(false)

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

  return (
    <Modal animationType="fade" transparent visible={visible}>
      <Animated.View style={[styles.modal, modalStyle]}>
        <Gallery
          data={['video']}
          onSwipeToClose={() => {
            close()
          }}
          onTap={() => {
            const next = !hidden

            StatusBar.setStatusBarHidden(next, 'fade')

            opacity.set(() => withTiming(next ? 0 : 1))

            setHidden(next)
          }}
          renderItem={({ setImageDimensions }) => {
            setImageDimensions(video)

            return (
              <VideoView
                allowsFullscreen={false}
                allowsPictureInPicture={false}
                allowsVideoFrameAnalysis={false}
                contentFit="contain"
                nativeControls={false}
                player={player}
                pointerEvents="none"
                style={styles.video}
              />
            )
          }}
          style={styles.main}
        />

        <Animated.View
          pointerEvents="box-none"
          style={[styles.header, controlStyle]}
        >
          <HeaderButton
            icon="X"
            onPress={() => {
              close()
            }}
            style={styles.close}
            weight="bold"
          />
        </Animated.View>

        <VideoControls opacity={opacity} player={player} />
      </Animated.View>
    </Modal>
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  close: {
    marginLeft: 'auto',
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
  main: {
    backgroundColor: theme.colors.gray[1],
  },
  modal: {
    flex: 1,
  },
  video: {
    flex: 1,
  },
}))
