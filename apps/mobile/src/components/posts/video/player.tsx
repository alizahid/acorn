import { Image } from 'expo-image'
import { useVideoPlayer, type VideoSource, VideoView } from 'expo-video'
import { useCallback, useEffect, useRef, useState } from 'react'
import { type StyleProp, StyleSheet, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { Pressable } from '~/components/common/pressable'
import { View } from '~/components/common/view'
import { useHistory } from '~/hooks/history'
import { usePreferences } from '~/stores/preferences'
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

  const { styles, theme } = useStyles(stylesheet)

  const ref = useRef<VideoView>(null)
  const previous = useRef(source)

  const previousMuted = useRef(feedMuted)

  const [fullscreen, setFullscreen] = useState(false)
  const [muted, setMuted] = useState(feedMuted)

  const player = useVideoPlayer(source, (instance) => {
    instance.muted = muted
    instance.loop = true
    instance.audioMixingMode = 'mixWithOthers'
    instance.timeUpdateEventInterval = 1_000 / 1_000 / 60

    if (viewing) {
      instance.play()
    }
  })

  useEffect(() => {
    if (previous.current !== source) {
      player.replace(source)

      previous.current = source
    }
  }, [player, source])

  useEffect(() => {
    if (fullscreen || (viewing && autoPlay)) {
      player.play()
    } else {
      player.pause()
    }
  }, [autoPlay, fullscreen, player, viewing])

  const onFullscreenEnter = useCallback(() => {
    setFullscreen(true)

    previousMuted.current = muted

    if (unmuteFullscreen && muted) {
      setMuted(false)

      // eslint-disable-next-line react-compiler/react-compiler -- go away
      player.muted = false
    }
  }, [muted, player, unmuteFullscreen])

  const onFullscreenExit = useCallback(() => {
    setFullscreen(false)

    setMuted(previousMuted.current)

    player.muted = previousMuted.current
  }, [player])

  if (compact) {
    return (
      <Pressable
        delayed
        label={a11y('viewVideo')}
        onPress={() => {
          void ref.current?.enterFullscreen()

          if (recyclingKey && seenOnMedia) {
            addPost({
              id: recyclingKey,
            })
          }
        }}
        style={styles.compact(large)}
      >
        <Image
          accessibilityIgnoresInvertColors
          source={video.thumbnail}
          style={styles.compactImage}
        />

        <View align="center" justify="center" style={styles.compactIcon}>
          <Icon color={theme.colors.accent.accent} name="Play" weight="fill" />
        </View>

        <VideoView
          allowsPictureInPicture={pictureInPicture}
          contentFit="cover"
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
      delayed
      label={a11y('viewVideo')}
      onPress={() => {
        void ref.current?.enterFullscreen()

        if (recyclingKey && seenOnMedia) {
          addPost({
            id: recyclingKey,
          })
        }
      }}
      style={[styles.main, style]}
    >
      <VideoView
        allowsFullscreen={false}
        allowsPictureInPicture
        contentFit="cover"
        nativeControls={fullscreen}
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
          hitSlop={theme.space[2]}
          label={a11y(muted ? 'unmute' : 'mute')}
          onPress={() => {
            const next = !muted

            setMuted(() => next)

            player.muted = next
          }}
          p="2"
          style={styles.volume}
        >
          <Icon
            color={theme.colors.gray.contrast}
            name={muted ? 'SpeakerSimpleX' : 'SpeakerSimpleHigh'}
            size={theme.space[4]}
          />
        </Pressable>
      )}
    </Pressable>
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  blur: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    gap: theme.space[4],
    justifyContent: 'center',
  },
  compact: (large?: boolean) => ({
    backgroundColor: theme.colors.gray.ui,
    borderCurve: 'continuous',
    borderRadius: theme.space[large ? 2 : 1],
    height: theme.space[8] * (large ? 2 : 1),
    overflow: 'hidden',
    width: theme.space[8] * (large ? 2 : 1),
  }),
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
  video: (aspectRatio: number) => ({
    aspectRatio,
  }),
  volume: {
    backgroundColor: theme.colors.black.accentAlpha,
    borderCurve: 'continuous',
    borderRadius: theme.space[4],
    bottom: theme.space[2],
    position: 'absolute',
    right: theme.space[2],
  },
}))
