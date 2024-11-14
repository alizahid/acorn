import { BlurView } from 'expo-blur'
import { Image } from 'expo-image'
import { useVideoPlayer, type VideoSource, VideoView } from 'expo-video'
import { useEffect, useRef, useState } from 'react'
import { type StyleProp, StyleSheet, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Text } from '~/components/common/text'
import { View } from '~/components/common/view'
import { useHistory } from '~/hooks/history'
import { usePreferences } from '~/stores/preferences'
import { type PostMedia } from '~/types/post'

import { Icon } from '../../common/icon'
import { Pressable } from '../../common/pressable'

type Props = {
  compact?: boolean
  crossPost?: boolean
  nsfw?: boolean
  recyclingKey?: string
  source: VideoSource
  style?: StyleProp<ViewStyle>
  video: PostMedia
  viewing: boolean
}

export function VideoPlayer({
  compact,
  crossPost,
  nsfw,
  recyclingKey,
  source,
  style,
  video,
  viewing,
}: Props) {
  const t = useTranslations('component.posts.video')

  const {
    blurNsfw,
    feedMuted,
    largeThumbnails,
    seenOnMedia,
    unmuteFullscreen,
  } = usePreferences()
  const { addPost } = useHistory()

  const { styles, theme } = useStyles(stylesheet)

  const ref = useRef<VideoView>(null)

  const [visible, setVisible] = useState(false)
  const [muted, setMuted] = useState(feedMuted)

  const player = useVideoPlayer(source, (instance) => {
    instance.muted = true
    instance.loop = true

    if (viewing) {
      instance.play()
    }
  })

  useEffect(() => {
    player.muted = muted

    if (visible || viewing) {
      player.play()
    } else {
      player.pause()
    }
  }, [blurNsfw, muted, nsfw, player, viewing, visible])

  if (compact) {
    return (
      <Pressable
        onPress={() => {
          setMuted(!unmuteFullscreen)
          setVisible(true)

          if (recyclingKey && seenOnMedia) {
            addPost({
              id: recyclingKey,
            })
          }
        }}
        style={styles.compact(largeThumbnails)}
      >
        <Image source={video.thumbnail} style={styles.compactImage} />

        <View align="center" justify="center" style={styles.compactIcon}>
          <Icon color={theme.colors.accent.a9} name="Play" weight="fill" />
        </View>

        {nsfw && blurNsfw ? (
          <BlurView intensity={100} pointerEvents="none" style={styles.blur} />
        ) : null}
      </Pressable>
    )
  }

  return (
    <Pressable
      onPress={() => {
        setMuted(!unmuteFullscreen)

        void ref.current?.enterFullscreen()

        if (recyclingKey && seenOnMedia) {
          addPost({
            id: recyclingKey,
          })
        }
      }}
      style={[styles.main(crossPost), style]}
    >
      <VideoView
        allowsFullscreen={false}
        allowsPictureInPicture={false}
        allowsVideoFrameAnalysis={false}
        contentFit="cover"
        onFullscreenEnter={() => {
          setVisible(visible)
        }}
        onFullscreenExit={() => {
          setVisible(false)
        }}
        player={player}
        ref={ref}
        style={styles.video(video.width / video.height)}
      />

      {nsfw && blurNsfw ? (
        <BlurView intensity={100} pointerEvents="none" style={styles.blur}>
          <Icon
            color={theme.colors.gray.a12}
            name="Warning"
            size={theme.space[6]}
            weight="fill"
          />

          <Text weight="medium">{t('nsfw')}</Text>
        </BlurView>
      ) : (
        <Pressable
          hitSlop={theme.space[2]}
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
  compact: (large: boolean) => ({
    backgroundColor: theme.colors.gray.a3,
    borderCurve: 'continuous',
    borderRadius: theme.space[large ? 2 : 1],
    height: theme.space[8] * (large ? 2 : 1),
    overflow: 'hidden',
    width: theme.space[8] * (large ? 2 : 1),
  }),
  compactIcon: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.black.a9,
  },
  compactImage: {
    flex: 1,
  },
  main: (crossPost?: boolean) => ({
    justifyContent: 'center',
    maxHeight: runtime.screen.height * (crossPost ? 0.3 : 0.5),
    overflow: 'hidden',
  }),
  video: (aspectRatio: number) => ({
    aspectRatio,
  }),
  volume: {
    backgroundColor: theme.colors.black.a9,
    borderCurve: 'continuous',
    borderRadius: theme.space[4],
    bottom: theme.space[2],
    position: 'absolute',
    right: theme.space[2],
  },
}))
