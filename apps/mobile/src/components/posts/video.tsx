import { useVideoPlayer, VideoView } from 'expo-video'
import { useEffect, useRef, useState } from 'react'
import {
  Pressable as ReactNativePressable,
  type StyleProp,
  View,
  type ViewStyle,
} from 'react-native'
import { useSafeAreaFrame } from 'react-native-safe-area-context'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { getDimensions } from '~/lib/media'
import { usePreferences } from '~/stores/preferences'
import { type PostMedia } from '~/types/post'

import { Icon, type IconName } from '../common/icon'
import { Pressable } from '../common/pressable'

type Props = {
  margin?: number
  style?: StyleProp<ViewStyle>
  video: PostMedia
  viewing: boolean
}

export function PostVideoCard({ margin = 0, style, video, viewing }: Props) {
  const frame = useSafeAreaFrame()

  const ref = useRef<VideoView>(null)

  const { muted, updatePreferences } = usePreferences()

  const { styles, theme } = useStyles(stylesheet)

  const [playing, setPlaying] = useState(false)
  const [sound, setSound] = useState(false)

  const player = useVideoPlayer(video.url, (instance) => {
    instance.loop = true
    instance.muted = !sound

    if (viewing) {
      instance.play()
    }
  })

  useEffect(() => {
    if (viewing) {
      player.play()
    } else {
      player.pause()
    }
  }, [player, viewing])

  useEffect(() => {
    setSound(() => {
      const next = viewing && !muted

      player.muted = !next

      return next
    })
  }, [muted, player, viewing])

  useEffect(() => {
    const subscription = player.addListener('playingChange', (isPlaying) => {
      setPlaying(isPlaying)
    })

    return () => {
      subscription.remove()
    }
  }, [player])

  const controls = [
    {
      icon: (sound ? 'SpeakerSimpleHigh' : 'SpeakerSimpleX') satisfies IconName,
      key: 'volume',
      onPress() {
        updatePreferences({
          muted: !muted,
        })
      },
    },
  ] as const

  const { height } = getDimensions(frame.width - margin, video)

  return (
    <View style={[styles.main(height, frame.width - margin), style]}>
      <ReactNativePressable
        onPress={() => {
          if (playing) {
            player.pause()
          } else {
            player.play()
          }

          setPlaying(!playing)
        }}
        style={styles.video}
      >
        <VideoView
          allowsFullscreen={false}
          allowsPictureInPicture={false}
          allowsVideoFrameAnalysis={false}
          nativeControls={false}
          player={player}
          ref={ref}
          style={styles.video}
        />

        {!playing ? (
          <View style={styles.play}>
            <Icon
              color={theme.colors.accent[9]}
              name="PlayCircle"
              size={frame.width / 8}
              weight="fill"
            />
          </View>
        ) : null}
      </ReactNativePressable>

      <View style={styles.controls}>
        {controls.map((control) => (
          <Pressable
            key={control.key}
            onPress={() => {
              control.onPress()
            }}
            style={styles.control}
          >
            <Icon color={theme.colors.gray.a11} name={control.icon} size={20} />
          </Pressable>
        ))}
      </View>
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  control: {
    padding: theme.space[2],
  },
  controls: {
    alignItems: 'center',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    left: 0,
    position: 'absolute',
    right: 0,
  },
  main: (height: number, width: number) => ({
    backgroundColor: theme.colors.gray.a2,
    height,
    width,
  }),
  play: {
    alignItems: 'center',
    bottom: 0,
    flex: 1,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  video: {
    flex: 1,
  },
}))
