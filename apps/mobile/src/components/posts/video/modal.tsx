import * as StatusBar from 'expo-status-bar'
import { type VideoPlayer, VideoView } from 'expo-video'
import { useCallback, useEffect, useState } from 'react'
import { Modal } from 'react-native'
import Gallery from 'react-native-awesome-gallery'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { HeaderButton } from '~/components/navigation/header-button'
import { type PostMedia } from '~/types/post'

type Props = {
  onClose: () => void
  player: VideoPlayer
  video: PostMedia
  visible: boolean
}

export function VideoModal({ onClose, player, video, visible }: Props) {
  const { styles } = useStyles(stylesheet)

  const opacity = useSharedValue(1)

  const [playing, setPlaying] = useState(player.playing)
  const [hidden, setHidden] = useState(false)

  const style = useAnimatedStyle(() => ({
    opacity: opacity.get(),
  }))

  useEffect(() => {
    const playingChange = player.addListener('playingChange', (next) => {
      setPlaying(next)
    })

    return () => {
      playingChange.remove()
    }
  }, [player])

  const close = useCallback(() => {
    onClose()

    StatusBar.setStatusBarHidden(false, 'fade')

    opacity.set(() => withTiming(1))

    setHidden(false)
  }, [onClose, opacity])

  return (
    <Modal animationType="fade" transparent visible={visible}>
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

      <Animated.View pointerEvents="box-none" style={[styles.header, style]}>
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
          icon="SkipBack"
          onPress={() => {
            player.seekBy(-10)
          }}
          weight="duotone"
        />

        <HeaderButton
          icon={playing ? 'Pause' : 'Play'}
          onPress={() => {
            if (playing) {
              player.pause()
            } else {
              player.play()
            }
          }}
          weight="fill"
        />

        <HeaderButton
          icon="SkipForward"
          onPress={() => {
            player.seekBy(10)
          }}
          weight="duotone"
        />
      </Animated.View>
    </Modal>
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  close: {
    marginLeft: 'auto',
  },
  footer: {
    alignItems: 'center',
    bottom: theme.space[9] + runtime.insets.bottom,
    flexDirection: 'row',
    gap: theme.space[2],
    justifyContent: 'center',
    left: theme.space[4],
    position: 'absolute',
    right: theme.space[4],
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
  video: {
    flex: 1,
  },
}))
