import { Zoomable } from '@likashefqet/react-native-image-zoom'
import { useEvent } from 'expo'
import { VideoView } from 'expo-video'
import { useRef } from 'react'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { useVideo } from '~/hooks/video'
import { usePreferences } from '~/stores/preferences'
import { type PostMedia } from '~/types/post'

import { IconButton } from '../common/icon/button'
import { View } from '../common/view'
import { VideoStatus } from '../posts/video/status'

type Props = {
  item: PostMedia
}

export function GalleryVideo({ item }: Props) {
  const a11y = useTranslations('a11y')

  const { unmuteFullscreen } = usePreferences()

  const ref = useRef<VideoView>(null)

  const player = useVideo(item.url, (instance) => {
    instance.loop = true
    instance.audioMixingMode = 'mixWithOthers'
    instance.muted = !unmuteFullscreen
    instance.timeUpdateEventInterval = 1000 / 1000 / 60

    instance.play()
  })

  const { isPlaying } = useEvent(player, 'playingChange', {
    isPlaying: player.playing,
  })

  const { muted } = useEvent(player, 'mutedChange', {
    muted: player.muted,
  })

  return (
    <View style={styles.main}>
      <View style={styles.item(item.width, item.height)}>
        <Zoomable isDoubleTapEnabled>
          <VideoView
            accessibilityIgnoresInvertColors
            fullscreenOptions={{
              enable: false,
            }}
            player={player}
            pointerEvents="none"
            ref={ref}
            style={styles.video}
          />

          <VideoStatus player={player} />
        </Zoomable>
      </View>

      <View direction="row" justify="center" px="2" style={styles.controls}>
        <IconButton
          icon="10.arrow.trianglehead.counterclockwise"
          label={a11y('rewind')}
          onPress={() => {
            player.seekBy(-10)
          }}
          weight="bold"
        />

        <IconButton
          icon={isPlaying ? 'pause.fill' : 'play.fill'}
          label={a11y(isPlaying ? 'pause' : 'play')}
          onPress={() => {
            if (isPlaying) {
              player.pause()
            } else {
              player.play()
            }
          }}
        />

        <IconButton
          icon="10.arrow.trianglehead.clockwise"
          label={a11y('fastForward')}
          onPress={() => {
            player.seekBy(10)
          }}
          weight="bold"
        />

        <IconButton
          icon={muted ? 'speaker.slash' : 'speaker.2'}
          label={a11y(muted ? 'unmute' : 'mute')}
          onPress={() => {
            player.muted = !muted
          }}
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
  item: (width: number, height: number) => ({
    height: (height / width) * runtime.screen.width,
    width: runtime.screen.width,
  }),
  main: {
    height: runtime.screen.height,
    justifyContent: 'center',
    width: runtime.screen.width,
  },
  video: {
    flex: 1,
  },
}))
