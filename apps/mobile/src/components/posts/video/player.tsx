import { BlurView } from 'expo-blur'
import { useVideoPlayer, type VideoSource, VideoView } from 'expo-video'
import { useEffect, useState } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Text } from '~/components/common/text'
import { getAspectRatio } from '~/lib/media'
import { usePreferences } from '~/stores/preferences'
import { type PostMedia } from '~/types/post'

import { FakeModal } from '../../common/fake-modal'
import { Icon } from '../../common/icon'
import { Pressable } from '../../common/pressable'

type Props = {
  nsfw?: boolean
  source: VideoSource
  style?: StyleProp<ViewStyle>
  video: PostMedia
  viewing: boolean
}

export function VideoPlayer({ nsfw, source, style, video, viewing }: Props) {
  const t = useTranslations('component.posts.video')

  const preferences = usePreferences()

  const { styles, theme } = useStyles(stylesheet)

  const [visible, setVisible] = useState(false)

  const player = useVideoPlayer(source, (instance) => {
    instance.muted = true
    instance.loop = true

    if (viewing) {
      instance.play()
    }
  })

  useEffect(() => {
    player.muted = visible ? false : !viewing || preferences.feedMuted

    if (visible || (viewing && (preferences.blurNsfw ? !nsfw : true))) {
      player.play()
    } else {
      player.pause()
    }
  }, [
    nsfw,
    player,
    preferences.blurNsfw,
    preferences.feedMuted,
    viewing,
    visible,
  ])

  return (
    <>
      <Pressable
        onPress={() => {
          setVisible(true)
        }}
        style={[styles.main(getAspectRatio(video)), style]}
      >
        <VideoView
          allowsFullscreen={false}
          allowsPictureInPicture={false}
          allowsVideoFrameAnalysis={false}
          contentFit="cover"
          nativeControls={false}
          player={player}
          style={styles.video}
        />

        {nsfw && preferences.blurNsfw ? (
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
            hitSlop={theme.space[3]}
            onPress={() => {
              preferences.update({
                feedMuted: !preferences.feedMuted,
              })
            }}
            p="2"
            style={styles.volume}
          >
            <Icon
              color={theme.colors.white.a11}
              name={
                preferences.feedMuted ? 'SpeakerSimpleX' : 'SpeakerSimpleHigh'
              }
              size={theme.space[4]}
            />
          </Pressable>
        )}
      </Pressable>

      <FakeModal
        onClose={() => {
          setVisible(false)
        }}
        style={styles.modal}
        visible={visible}
      >
        <VideoView
          allowsFullscreen={false}
          allowsPictureInPicture={false}
          allowsVideoFrameAnalysis={false}
          contentFit="contain"
          nativeControls
          player={player}
          style={styles.full(video.width / video.height)}
        />
      </FakeModal>
    </>
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  blur: {
    alignItems: 'center',
    bottom: 0,
    gap: theme.space[4],
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  full: (aspectRatio: number) => ({
    aspectRatio,
    maxHeight: runtime.screen.height,
    width: runtime.screen.width,
  }),
  main: (aspectRatio: number) => ({
    aspectRatio,
    width: '100%',
  }),
  modal: {
    justifyContent: 'center',
  },
  video: {
    flex: 1,
  },
  volume: {
    backgroundColor: theme.colors.black.a9,
    borderCurve: 'continuous',
    borderRadius: theme.space[4],
    bottom: theme.space[3],
    position: 'absolute',
    right: theme.space[3],
  },
}))
