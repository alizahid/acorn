import { Image } from 'expo-image'
import { useVideoPlayer, type VideoSource, VideoView } from 'expo-video'
import { useEffect, useRef, useState } from 'react'
import { type StyleProp, StyleSheet, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { View } from '~/components/common/view'
import { useHistory } from '~/hooks/history'
import { usePreferences } from '~/stores/preferences'
import { type PostMedia } from '~/types/post'

import { Icon } from '../../common/icon'
import { Pressable } from '../../common/pressable'
import { GalleryBlur } from '../gallery/blur'

type Props = {
  compact?: boolean
  large?: boolean
  nsfw?: boolean
  onLongPress?: () => void
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
  onLongPress,
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
    seenOnMedia,
    unmuteFullscreen,
  } = usePreferences()
  const { addPost } = useHistory()

  const { styles, theme } = useStyles(stylesheet)

  const ref = useRef<VideoView>(null)

  const previousMuted = useRef(feedMuted)

  const [fullscreen, setFullscreen] = useState(false)
  const [muted, setMuted] = useState(feedMuted)

  const player = useVideoPlayer(source, (instance) => {
    instance.muted = true
    instance.loop = true
    instance.audioMixingMode = 'mixWithOthers'

    if (viewing) {
      instance.play()
    }
  })

  useEffect(() => {
    if (player.muted !== muted) {
      // eslint-disable-next-line react-compiler/react-compiler -- go away
      player.muted = muted
    }

    if (fullscreen || (viewing && autoPlay)) {
      player.play()
    } else {
      player.pause()
    }
  }, [autoPlay, fullscreen, muted, player, viewing])

  if (compact) {
    return (
      <Pressable
        delayed
        label={a11y('viewVideo')}
        onLongPress={onLongPress}
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
          contentFit="cover"
          onFullscreenEnter={() => {
            previousMuted.current = muted

            if (unmuteFullscreen && muted) {
              setMuted(false)
            }

            setFullscreen(true)
          }}
          onFullscreenExit={() => {
            if (previousMuted.current !== muted) {
              setMuted(previousMuted.current)
            }

            setFullscreen(false)
          }}
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
      onLongPress={onLongPress}
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
        allowsPictureInPicture={false}
        allowsVideoFrameAnalysis={false}
        contentFit="cover"
        onFullscreenEnter={() => {
          previousMuted.current = muted

          if (unmuteFullscreen && muted) {
            setMuted(false)
          }

          setFullscreen(true)
        }}
        onFullscreenExit={() => {
          setMuted(previousMuted.current)

          setFullscreen(false)
        }}
        player={player}
        ref={ref}
        style={styles.video(video.width / video.height)}
      />

      {Boolean(nsfw && blurNsfw) || Boolean(spoiler && blurSpoiler) ? (
        <GalleryBlur label={t(spoiler ? 'spoiler' : 'nsfw')} />
      ) : (
        <Pressable
          hitSlop={theme.space[2]}
          label={a11y(muted ? 'unmute' : 'mute')}
          onPress={() => {
            setMuted(() => !muted)
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
