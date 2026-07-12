import { useEffect, useRef, useState } from 'react'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import {
  useEvent,
  useVideoPlayer,
  VideoView,
  type VideoViewRef,
} from 'react-native-video'
import { useTranslations } from 'use-intl'
import { useShallow } from 'zustand/react/shallow'

import { Icon } from '~/components/common/icon'
import { InView } from '~/components/common/in-view'
import { Pressable } from '~/components/common/pressable'
import { useHistory } from '~/hooks/history'
import { usePreferences } from '~/stores/preferences'
import { space } from '~/styles/tokens'
import { type PostMedia } from '~/types/post'

import { GalleryBlur } from '../gallery/blur'
import { VideoStatus } from './status'

type Props = {
  compact?: boolean
  nsfw?: boolean
  recyclingKey?: string
  spoiler?: boolean
  video: PostMedia
  onLongPress?: () => void
}

export function VideoPlayer({
  compact,
  nsfw,
  recyclingKey,
  spoiler,
  video,
  onLongPress,
}: Props) {
  const t = useTranslations('component.posts.video')
  const a11y = useTranslations('a11y')

  const {
    autoPlay,
    blurNsfw,
    blurSpoiler,
    feedMuted,
    pictureInPicture,
    seenOnMedia,
    unmuteFullscreen,
  } = usePreferences(
    useShallow((state) => ({
      autoPlay: state.autoPlay,
      blurNsfw: state.blurNsfw,
      blurSpoiler: state.blurSpoiler,
      feedMuted: state.feedMuted,
      pictureInPicture: state.pictureInPicture,
      seenOnMedia: state.seenOnMedia,
      unmuteFullscreen: state.unmuteFullscreen,
    })),
  )

  const { addPost } = useHistory()

  styles.useVariants({
    compact,
  })

  const ref = useRef<VideoViewRef>(null)

  const player = useVideoPlayer(video.url, (instance) => {
    instance.mixAudioMode = 'mixWithOthers'
    instance.muted = feedMuted
    instance.loop = true

    instance.pause()
  })

  const [visible, setVisible] = useState(false)
  const [muted, setMuted] = useState(feedMuted)

  useEffect(() => {
    if (!compact && visible && autoPlay) {
      player.play()
    } else {
      player.pause()
    }
  }, [autoPlay, player, visible, compact])

  useEvent(player, 'onVolumeChange', (event) => {
    setMuted(event.muted)
  })

  function onPress() {
    ref.current?.enterFullscreen()

    if (recyclingKey && seenOnMedia) {
      addPost({
        id: recyclingKey,
      })
    }
  }

  return (
    <Pressable
      accessibilityLabel={a11y('viewVideo')}
      onLongPress={onLongPress}
      onPress={onPress}
      style={styles.main}
    >
      <InView onChange={setVisible}>
        <VideoView
          accessibilityIgnoresInvertColors
          controls
          pictureInPicture={pictureInPicture}
          player={player}
          pointerEvents="none"
          ref={ref}
          style={styles.video(video.width / video.height)}
          willEnterFullscreen={() => {
            player.play()

            if (unmuteFullscreen && muted) {
              player.muted = false
            }
          }}
          willExitFullscreen={() => {
            if (compact || !autoPlay) {
              player.pause()
            }
          }}
        />
      </InView>

      {compact ? null : <VideoStatus player={player} />}

      {compact ? (
        <View style={styles.compact}>
          <Icon name="play-fill" />

          {(nsfw && blurNsfw) || (spoiler && blurSpoiler) ? (
            <GalleryBlur />
          ) : null}
        </View>
      ) : (nsfw && blurNsfw) || (spoiler && blurSpoiler) ? (
        <GalleryBlur label={t(spoiler ? 'spoiler' : 'nsfw')} />
      ) : (
        <Pressable
          accessibilityLabel={a11y(muted ? 'unmute' : 'mute')}
          hitSlop={space[2]}
          onPress={() => {
            player.muted = !muted
          }}
          style={styles.volume}
        >
          <Icon
            name={muted ? 'speaker-x' : 'speaker-high'}
            uniProps={(theme) => ({
              color: theme.colors.gray.contrast,
              size: theme.space[4],
            })}
          />
        </Pressable>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create((theme, runtime) => ({
  compact: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    backgroundColor: theme.colors.black.accentAlpha,
    justifyContent: 'center',
  },
  main: {
    justifyContent: 'center',
    maxHeight: runtime.screen.height * 0.6,
    overflow: 'hidden',
  },
  video: (aspectRatio: number) => ({
    variants: {
      compact: {
        default: {
          aspectRatio,
        },
        true: {
          aspectRatio: 1,
        },
      },
    },
  }),
  volume: {
    backgroundColor: theme.colors.black.accentAlpha,
    borderCurve: 'continuous',
    borderRadius: theme.space[4],
    bottom: theme.space[3],
    padding: theme.space[2],
    position: 'absolute',
    right: theme.space[2],
  },
}))
