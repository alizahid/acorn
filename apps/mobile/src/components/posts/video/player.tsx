import { BlurView } from 'expo-blur'
import { useVideoPlayer, type VideoSource, VideoView } from 'expo-video'
import { useEffect, useState } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Text } from '~/components/common/text'
import { useCommon } from '~/hooks/common'
import { getDimensions } from '~/lib/media'
import { usePreferences } from '~/stores/preferences'
import { type PostMedia } from '~/types/post'

import { FakeModal } from '../../common/fake-modal'
import { Icon } from '../../common/icon'
import { Pressable } from '../../common/pressable'

type Props = {
  margin?: number
  nsfw?: boolean
  source: VideoSource
  style?: StyleProp<ViewStyle>
  video: PostMedia
  viewing: boolean
}

export function VideoPlayer({
  margin = 0,
  nsfw,
  source,
  style,
  video,
  viewing,
}: Props) {
  const t = useTranslations('component.posts.video')

  const common = useCommon()

  const { blurNsfw, feedMuted, update } = usePreferences()

  const { styles, theme } = useStyles(stylesheet)

  const [visible, setVisible] = useState(false)

  const frameWidth = common.frame.width - margin

  const player = useVideoPlayer(source, (instance) => {
    instance.muted = true
    instance.loop = true

    if (viewing) {
      instance.play()
    }
  })

  useEffect(() => {
    player.muted = visible ? false : !viewing || feedMuted

    if (visible || (viewing && (blurNsfw ? !nsfw : true))) {
      player.play()
    } else {
      player.pause()
    }
  }, [blurNsfw, feedMuted, nsfw, player, viewing, visible])

  const dimensions = getDimensions(frameWidth, video)

  return (
    <>
      <Pressable
        onPress={() => {
          setVisible(true)
        }}
        style={style}
      >
        <VideoView
          allowsFullscreen={false}
          allowsPictureInPicture={false}
          allowsVideoFrameAnalysis={false}
          contentFit="cover"
          nativeControls={false}
          player={player}
          style={styles.main(
            common.height.max,
            dimensions.height,
            dimensions.width,
          )}
        />

        {nsfw && blurNsfw ? (
          <BlurView
            intensity={100}
            pointerEvents="none"
            style={[
              styles.main(
                common.height.max,
                dimensions.height,
                dimensions.width,
              ),
              styles.blur,
            ]}
          >
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
              update({
                feedMuted: !feedMuted,
              })
            }}
            p="2"
            style={styles.volume}
          >
            <Icon
              color={theme.colors.white.a11}
              name={feedMuted ? 'SpeakerSimpleX' : 'SpeakerSimpleHigh'}
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
          style={styles.video(
            common.frame.height,
            common.frame.width,
            video.height,
            video.width,
          )}
        />
      </FakeModal>
    </>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  blur: {
    alignItems: 'center',
    gap: theme.space[4],
    justifyContent: 'center',
    position: 'absolute',
  },
  main: (maxHeight: number, height: number, width: number) => ({
    height: Math.min(maxHeight, height),
    width,
  }),
  modal: {
    justifyContent: 'center',
  },
  video: (
    frameHeight: number,
    frameWidth: number,
    height: number,
    width: number,
  ) => {
    const dimensions = getDimensions(frameWidth, {
      height,
      width,
    })

    return {
      height: dimensions.height,
      maxHeight: frameHeight,
      width: dimensions.width,
    }
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
