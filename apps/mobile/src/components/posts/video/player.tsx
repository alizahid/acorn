import { useEvent } from 'expo'
import { useVideoPlayer, VideoView } from 'expo-video'
import { useEffect, useRef, useState } from 'react'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { Pressable } from '~/components/common/pressable'
import { VisibilitySensor } from '~/components/common/sensor/visibility'
import { useHistory } from '~/hooks/history'
import { usePreferences } from '~/stores/preferences'
import { space } from '~/styles/tokens'
import { type PostMedia } from '~/types/post'

import { GalleryBlur } from '../gallery/blur'
import { VideoMenu } from './menu'
import { VideoStatus } from './status'

type Props = {
  compact?: boolean
  nsfw?: boolean
  recyclingKey?: string
  spoiler?: boolean
  video: PostMedia
}

export function VideoPlayer({
  compact,
  nsfw,
  recyclingKey,
  spoiler,
  video,
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
  } = usePreferences()
  const { addPost } = useHistory()

  styles.useVariants({
    compact,
  })

  const ref = useRef<VideoView>(null)

  const player = useVideoPlayer(video.url, (instance) => {
    instance.audioMixingMode = 'mixWithOthers'
    instance.muted = feedMuted
    instance.loop = true
    instance.timeUpdateEventInterval = 1000 / 1000 / 60

    instance.pause()
  })

  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!compact && visible && autoPlay) {
      player.play()
    } else {
      player.pause()
    }
  }, [autoPlay, player, visible, compact])

  const { muted } = useEvent(player, 'mutedChange', {
    muted: feedMuted,
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
    <VideoMenu url={video.url}>
      <Pressable
        accessibilityLabel={a11y('viewVideo')}
        onPress={onPress}
        style={styles.main}
      >
        <VisibilitySensor
          id={video.url}
          onChange={(next) => {
            setVisible(next.full)
          }}
        >
          <VideoView
            accessibilityIgnoresInvertColors
            allowsPictureInPicture={pictureInPicture}
            contentFit="cover"
            fullscreenOptions={{
              enable: false,
            }}
            onFullscreenEnter={() => {
              player.play()

              if (unmuteFullscreen && muted) {
                player.muted = false
              }
            }}
            onFullscreenExit={() => {
              if (compact || !autoPlay) {
                player.pause()
              }
            }}
            player={player}
            pointerEvents="none"
            ref={ref}
            style={styles.video(video.width / video.height)}
          />
        </VisibilitySensor>

        {compact ? null : <VideoStatus player={player} />}

        {compact ? (
          <Pressable
            accessibilityLabel={a11y('viewVideo')}
            align="center"
            justify="center"
            onPress={onPress}
            style={styles.compact}
          >
            <Icon name="play.fill" />

            {Boolean(nsfw && blurNsfw) || Boolean(spoiler && blurSpoiler) ? (
              <GalleryBlur />
            ) : null}
          </Pressable>
        ) : Boolean(nsfw && blurNsfw) || Boolean(spoiler && blurSpoiler) ? (
          <GalleryBlur label={t(spoiler ? 'spoiler' : 'nsfw')} />
        ) : (
          <Pressable
            accessibilityLabel={a11y(muted ? 'unmute' : 'mute')}
            hitSlop={space[2]}
            onPress={() => {
              player.muted = !muted
            }}
            p="2"
            style={styles.volume}
          >
            <Icon
              name={muted ? 'speaker.slash' : 'speaker.2'}
              uniProps={(theme) => ({
                size: theme.space[4],
                tintColor: theme.colors.gray.contrast,
              })}
            />
          </Pressable>
        )}
      </Pressable>
    </VideoMenu>
  )
}

const styles = StyleSheet.create((theme, runtime) => ({
  compact: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.black.accentAlpha,
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
    position: 'absolute',
    right: theme.space[2],
  },
}))
