import { useRecyclingState } from '@shopify/flash-list'
import { useEventListener } from 'expo'
import { Image } from 'expo-image'
import { useVideoPlayer, type VideoSource, VideoView } from 'expo-video'
import { useCallback, useEffect, useRef } from 'react'
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

  const { styles, theme } = useStyles(stylesheet)

  const ref = useRef<VideoView>(null)

  const previousMuted = useRef(feedMuted)

  const [muted, setMuted] = useRecyclingState(feedMuted, [recyclingKey])

  const player = useVideoPlayer(source, (instance) => {
    instance.audioMixingMode = 'mixWithOthers'
    instance.muted = muted
    instance.loop = true
    instance.timeUpdateEventInterval = 1_000 / 1_000 / 60

    if (viewing && autoPlay) {
      instance.play()
    } else {
      instance.pause()
    }
  })

  useEventListener(player, 'mutedChange', (event) => {
    setMuted(event.muted)
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

    previousMuted.current = muted

    if (unmuteFullscreen && muted) {
      // eslint-disable-next-line react-compiler/react-compiler -- go away
      player.muted = false
    }
  }, [muted, player, unmuteFullscreen])

  const onFullscreenExit = useCallback(() => {
    if (!autoPlay) {
      player.pause()
    }

    player.muted = previousMuted.current
  }, [autoPlay, player])

  if (compact) {
    return (
      <Pressable
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
          source={thumbnail ?? video.thumbnail}
          style={styles.compactImage}
        />

        <View align="center" justify="center" style={styles.compactIcon}>
          <Icon color={theme.colors.accent.accent} name="Play" weight="fill" />
        </View>

        <VideoView
          accessibilityIgnoresInvertColors
          allowsFullscreen={false}
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
      <Image
        accessibilityIgnoresInvertColors
        source={thumbnail ?? video.thumbnail}
        style={styles.thumbnail}
      />

      <VideoView
        accessibilityIgnoresInvertColors
        allowsFullscreen={false}
        allowsPictureInPicture={pictureInPicture}
        contentFit="cover"
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
            player.muted = !muted
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
    backgroundColor: theme.colors.gray.uiActive,
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
