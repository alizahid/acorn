import { useEvent } from 'expo'
import { Image } from 'expo-image'
import { useVideoPlayer, VideoView } from 'expo-video'
import { useEffect, useRef } from 'react'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { Pressable } from '~/components/common/pressable'
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
  thumbnail?: string
  video: PostMedia
  viewing: boolean
}

export function VideoPlayer({
  nsfw,
  recyclingKey,
  spoiler,
  thumbnail,
  video,
  viewing,
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

  const ref = useRef<VideoView>(null)
  const current = useRef<string>(video.url)

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
    if (viewing && autoPlay) {
      player.play()
    } else {
      player.pause()
    }
  }, [autoPlay, player, viewing])

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
        <Image
          accessibilityIgnoresInvertColors
          pointerEvents="none"
          source={thumbnail ?? video.thumbnail}
          style={styles.thumbnail}
        />

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
          style={styles.video(video.width / video.height)}
        />

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
  thumbnail: {
    ...StyleSheet.absoluteFillObject,
  },
  video: (aspectRatio: number) => ({
    aspectRatio,
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
