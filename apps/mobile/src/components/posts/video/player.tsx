import { useRecyclingState } from '@shopify/flash-list'
import { useRef } from 'react'
import { View } from 'react-native'
import { VideoView, type VideoViewRef } from 'react-native-jet-video'
import { useSharedValue } from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { useShallow } from 'zustand/react/shallow'

import { Icon } from '~/components/common/icon'
import { MediaMenu } from '~/components/common/media-menu'
import { Pressable } from '~/components/common/pressable'
import { Spinner } from '~/components/common/spinner'
import { useHistory } from '~/hooks/history'
import { usePreferences } from '~/stores/preferences'
import { space } from '~/styles/tokens'
import { type PostMedia } from '~/types/post'

import { GalleryBlur } from '../gallery/blur'
import { VideoStatus } from './status'

type Props = {
  compact?: boolean
  crossPost?: boolean
  large?: boolean
  nsfw?: boolean
  poster?: string
  recyclingKey?: string
  spoiler?: boolean
  video: PostMedia
}

export function VideoPlayer({
  compact = false,
  crossPost = false,
  large = false,
  nsfw,
  poster,
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
    crossPost,
    large,
  })

  const player = useRef<VideoViewRef>(null)

  const duration = useSharedValue(0)
  const current = useSharedValue(0)
  const buffered = useSharedValue(0)

  const [muted, setMuted] = useRecyclingState(feedMuted, [recyclingKey])
  const [loaded, setLoaded] = useRecyclingState(false, [recyclingKey])

  return (
    <Pressable
      accessibilityLabel={a11y('viewVideo')}
      onLongPress={() => {
        MediaMenu.call({
          type: 'video',
          url: video.url,
        })
      }}
      onPress={() => {
        player.current?.enterFullscreen()

        if (recyclingKey && seenOnMedia) {
          addPost({
            id: recyclingKey,
          })
        }
      }}
      style={styles.main}
      variant="plain"
    >
      <VideoView
        allowsPictureInPicture={pictureInPicture}
        autoplay={!compact && autoPlay ? 'whenVisible' : false}
        loop
        muted={muted}
        onFullscreenChange={(next) => {
          if (next) {
            player.current?.play()

            if (unmuteFullscreen && muted) {
              setMuted(false)
            }
          } else {
            if (compact || !autoPlay) {
              player.current?.pause()
            }

            if (feedMuted) {
              setMuted(true)
            }
          }
        }}
        onLoad={(event) => {
          setLoaded(true)

          duration.set(event.duration)
        }}
        onProgress={(event) => {
          current.set(event.currentTime)
          buffered.set(event.bufferedPosition)
        }}
        poster={poster}
        ref={player}
        source={video.url}
        style={styles.video(video.width / video.height)}
        visibilityAxis="vertical"
      />

      {compact ? null : (
        <VideoStatus
          buffered={buffered}
          current={current}
          duration={duration}
        />
      )}

      {loaded ? null : (
        <View style={styles.loading}>
          <Spinner />
        </View>
      )}

      {compact ? (
        <View style={styles.compact}>
          <Icon name="play-fill" />

          {(nsfw && blurNsfw) || (spoiler && blurSpoiler) ? (
            <GalleryBlur compact />
          ) : null}
        </View>
      ) : (nsfw && blurNsfw) || (spoiler && blurSpoiler) ? (
        <GalleryBlur label={t(spoiler ? 'spoiler' : 'nsfw')} />
      ) : (
        <Pressable
          accessibilityLabel={a11y(muted ? 'unmute' : 'mute')}
          hitSlop={space[3]}
          onPress={() => {
            setMuted((previous) => !previous)
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
  loading: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  main: {
    borderCurve: 'continuous',
    borderRadius: theme.radius[4],
    compoundVariants: [
      {
        compact: false,
        crossPost: false,
        styles: {
          marginHorizontal: -theme.space[3],
        },
      },
      {
        compact: true,
        large: true,
        styles: {
          borderRadius: theme.space[1] * 2,
          height: theme.space[8] * 2,
          width: theme.space[8] * 2,
        },
      },
      {
        compact: true,
        large: false,
        styles: {
          borderRadius: theme.space[1],
          height: theme.space[8],
          width: theme.space[8],
        },
      },
    ],
    justifyContent: 'center',
    maxHeight: runtime.screen.height * 0.8,
    overflow: 'hidden',
    variants: {
      compact: {
        true: {},
      },
      crossPost: {
        true: {},
      },
      large: {
        true: {},
      },
    },
  },
  video: (aspectRatio: number) => ({
    variants: {
      compact: {
        false: {
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
