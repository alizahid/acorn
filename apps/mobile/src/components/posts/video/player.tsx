import { VisibilitySensor } from '@futurejj/react-native-visibility-sensor'
import { useEvent } from 'expo'
import { useVideoPlayer, VideoView } from 'expo-video'
import { noop } from 'lodash'
import { useEffect, useRef, useState } from 'react'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { Pressable } from '~/components/common/pressable'
import { useFocused } from '~/hooks/focus'
import { useHistory } from '~/hooks/history'
import { usePreferences } from '~/stores/preferences'
import { space } from '~/styles/tokens'
import { type PostMedia } from '~/types/post'

import { GalleryBlur } from '../gallery/blur'
import { VideoMenu } from './menu'
import { VideoStatus } from './status'

type Props = {
  nsfw?: boolean
  recyclingKey?: string
  spoiler?: boolean
  video: PostMedia
}

export function VideoPlayer({ nsfw, recyclingKey, spoiler, video }: Props) {
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

  const { focused } = useFocused()

  const ref = useRef<VideoView>(null)
  const current = useRef<string>(null)

  const [visible, setVisible] = useState(false)

  const player = useVideoPlayer(null, (instance) => {
    instance.audioMixingMode = 'mixWithOthers'
    instance.muted = feedMuted
    instance.loop = true
    instance.timeUpdateEventInterval = 1000 / 1000 / 60

    instance.pause()
  })

  useEffect(() => {
    if (current.current !== video.url) {
      current.current = video.url

      player.replaceAsync(video.url)
    }
  }, [player, video.url])

  useEffect(() => {
    if (focused && visible && autoPlay) {
      player.play()
    } else {
      player.pause()
    }
  }, [autoPlay, player, visible, focused])

  const { muted } = useEvent(player, 'mutedChange', {
    muted: feedMuted,
  })

  return (
    <VideoMenu url={video.url}>
      <Pressable
        accessibilityLabel={a11y('viewVideo')}
        onPress={() => {
          ref.current?.enterFullscreen()

          if (recyclingKey && seenOnMedia) {
            addPost({
              id: recyclingKey,
            })
          }
        }}
        style={styles.main}
      >
        <VisibilitySensor
          onChange={noop}
          onPercentChange={(percent) => {
            const next = percent > 80

            if (next !== visible) {
              setVisible(next)
            }
          }}
          style={styles.sensor(video.width / video.height)}
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
              if (!autoPlay) {
                player.pause()
              }
            }}
            player={player}
            ref={ref}
            style={styles.video}
          />
        </VisibilitySensor>

        <VideoStatus player={player} />

        {Boolean(nsfw && blurNsfw) || Boolean(spoiler && blurSpoiler) ? (
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
  main: {
    justifyContent: 'center',
    maxHeight: runtime.screen.height * 0.6,
    overflow: 'hidden',
  },
  sensor: (aspectRatio: number) => ({
    aspectRatio,
  }),
  thumbnail: {
    ...StyleSheet.absoluteFillObject,
  },
  video: {
    flex: 1,
  },
  volume: {
    backgroundColor: theme.colors.black.accentAlpha,
    borderCurve: 'continuous',
    borderRadius: theme.space[4],
    bottom: theme.space[3],
    position: 'absolute',
    right: theme.space[2],
  },
}))
