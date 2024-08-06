import { useVideoPlayer, type VideoSource, VideoView } from 'expo-video'
import { useEffect, useState } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { useCommon } from '~/hooks/common'
import { getDimensions } from '~/lib/media'
import { usePreferences } from '~/stores/preferences'
import { type PostMedia } from '~/types/post'

import { FakeModal } from '../../common/fake-modal'
import { Icon } from '../../common/icon'
import { Pressable } from '../../common/pressable'

type Props = {
  margin?: number
  source: VideoSource
  style?: StyleProp<ViewStyle>
  video: PostMedia
  viewing: boolean
}

export function VideoPlayer({
  margin = 0,
  source,
  style,
  video,
  viewing,
}: Props) {
  const common = useCommon()

  const { muted, updatePreferences } = usePreferences()

  const { styles, theme } = useStyles(stylesheet)

  const [visible, setVisible] = useState(false)

  const frameWidth = common.frame.width - margin
  const maxHeight =
    common.frame.height -
    common.headerHeight -
    common.tabBarHeight -
    theme.space[9]

  const player = useVideoPlayer(source, (instance) => {
    instance.muted = true
    instance.loop = true

    if (viewing) {
      instance.play()
    }
  })

  useEffect(() => {
    player.muted = visible ? false : !viewing || muted

    if (viewing) {
      player.play()
    } else {
      player.pause()
    }
  }, [muted, player, viewing, visible])

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
          style={styles.main(maxHeight, dimensions.height, dimensions.width)}
        />

        <Pressable
          hitSlop={theme.space[3]}
          onPress={() => {
            updatePreferences({
              muted: !muted,
            })
          }}
          style={styles.volume}
        >
          <Icon
            color={theme.colors.white.a11}
            name={muted ? 'SpeakerSimpleX' : 'SpeakerSimpleHigh'}
            size={theme.space[4]}
          />
        </Pressable>
      </Pressable>

      <FakeModal
        onClose={() => {
          setVisible(false)
        }}
        visible={visible}
      >
        <VideoView
          allowsFullscreen={false}
          allowsPictureInPicture={false}
          allowsVideoFrameAnalysis={false}
          contentFit="contain"
          nativeControls
          player={player}
          style={styles.video}
        />
      </FakeModal>
    </>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: (maxHeight: number, height: number, width: number) => ({
    height: Math.min(maxHeight, height),
    width,
  }),
  video: {
    flex: 1,
  },
  volume: {
    backgroundColor: theme.colors.black.a9,
    borderRadius: theme.space[4],
    bottom: theme.space[3],
    padding: theme.space[2],
    position: 'absolute',
    right: theme.space[3],
  },
}))
