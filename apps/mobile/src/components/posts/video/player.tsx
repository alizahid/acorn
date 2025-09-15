import { useEvent } from 'expo'
import { Image } from 'expo-image'
import { useVideoPlayer, type VideoSource, VideoView } from 'expo-video'
import { useCallback, useEffect, useRef } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { Pressable } from '~/components/common/pressable'
import { View } from '~/components/common/view'
import { useHistory } from '~/hooks/history'
import { usePreferences } from '~/stores/preferences'
import { space } from '~/styles/tokens'
import { type PostMedia } from '~/types/post'

import { GalleryBlur } from '../gallery/blur'
import { VideoStatus } from './status'

type Props = {
  compact?: boolean
  large?: boolean
  nsfw?: boolean
  recyclingKey?: string
  source: VideoSource
  spoiler?: boolean
  style?: StyleProp<ViewStyle>
  thumbnail?: string
  video: PostMedia
  viewing: boolean
}

export function VideoPlayer({
  compact,
  large,
  nsfw,
  recyclingKey,
  source,
  spoiler,
  style,
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

  styles.useVariants({
    large,
  })

  const ref = useRef<VideoView>(null)

  const player = useVideoPlayer(source, (instance) => {
    instance.audioMixingMode = 'mixWithOthers'
    instance.muted = feedMuted
    instance.loop = true
    instance.timeUpdateEventInterval = 1000 / 1000 / 60

    if (viewing && autoPlay) {
      instance.play()
    } else {
      instance.pause()
    }
  })

  const { muted } = useEvent(player, 'mutedChange', {
    muted: feedMuted,
  })

  useEffect(() => {
    if (viewing && autoPlay) {
      player.play()
    } else {
      player.pause()
    }
  }, [autoPlay, player, viewing])

  const onFullscreenEnter = useCallback(() => {
    player.play()

    if (unmuteFullscreen && muted) {
      player.muted = false
    }
  }, [muted, player, unmuteFullscreen])

  const onFullscreenExit = useCallback(() => {
    if (!autoPlay) {
      player.pause()
    }
  }, [autoPlay, player])

  if (compact) {
    return (
      <Pressable
        label={a11y('viewVideo')}
        onPress={() => {
          ref.current?.enterFullscreen()

          if (recyclingKey && seenOnMedia) {
            addPost({
              id: recyclingKey,
            })
          }
        }}
        style={styles.compact}
      >
        <Image
          accessibilityIgnoresInvertColors
          source={thumbnail ?? video.thumbnail}
          style={styles.compactImage}
        />

        <View align="center" justify="center" style={styles.compactIcon}>
          <Icon name="play.fill" />
        </View>

        <VideoView
          accessibilityIgnoresInvertColors
          allowsPictureInPicture={pictureInPicture}
          contentFit="cover"
          fullscreenOptions={{
            enable: false,
          }}
          onFullscreenEnter={onFullscreenEnter}
          onFullscreenExit={onFullscreenExit}
          player={player}
          pointerEvents="none"
          ref={ref}
          style={styles.compactVideo}
        />

        {Boolean(nsfw && blurNsfw) || Boolean(spoiler && blurSpoiler) ? (
          <GalleryBlur />
        ) : null}
      </Pressable>
    )
  }

  return (
    <Pressable
      label={a11y('viewVideo')}
      onPress={() => {
        ref.current?.enterFullscreen()

        if (recyclingKey && seenOnMedia) {
          addPost({
            id: recyclingKey,
          })
        }
      }}
      style={[styles.main, style]}
    >
      <Image
        accessibilityIgnoresInvertColors
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
        onFullscreenEnter={onFullscreenEnter}
        onFullscreenExit={onFullscreenExit}
        player={player}
        ref={ref}
        style={styles.video(video.width / video.height)}
      />

      <VideoStatus player={player} />

      {Boolean(nsfw && blurNsfw) || Boolean(spoiler && blurSpoiler) ? (
        <GalleryBlur label={t(spoiler ? 'spoiler' : 'nsfw')} />
      ) : (
        <Pressable
          hitSlop={space[2]}
          label={a11y(muted ? 'unmute' : 'mute')}
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
  )
}

const styles = StyleSheet.create((theme, runtime) => ({
  blur: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    gap: theme.space[4],
    justifyContent: 'center',
  },
  compact: {
    backgroundColor: theme.colors.gray.uiActive,
    borderCurve: 'continuous',
    overflow: 'hidden',
    variants: {
      large: {
        false: {
          borderRadius: theme.space[1],
          height: theme.space[8],
          width: theme.space[8],
        },
        true: {
          borderRadius: theme.space[2],
          height: theme.space[8] * 2,
          width: theme.space[8] * 2,
        },
      },
    },
  },
  compactIcon: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.black.accentAlpha,
  },
  compactImage: {
    flex: 1,
  },
  compactVideo: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0,
  },
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
