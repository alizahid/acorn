import { useVideoPlayer, type VideoSource, VideoView } from 'expo-video'
import { useEffect, useRef, useState } from 'react'
import { Pressable as ReactNativePressable, View } from 'react-native'
import SpeakerHighIcon from 'react-native-phosphor/src/duotone/SpeakerHigh'
import SpeakerNoneIcon from 'react-native-phosphor/src/duotone/SpeakerNone'
import PlayIcon from 'react-native-phosphor/src/fill/Play'
import { useSafeAreaFrame } from 'react-native-safe-area-context'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { getGif } from '~/lib/red-gifs'
import { usePreferences } from '~/stores/preferences'
import { type PostVideo } from '~/types/post'

import { Pressable } from '../common/pressable'

type Props = {
  video: PostVideo
}

export function PostVideo({ video }: Props) {
  const frame = useSafeAreaFrame()

  const ref = useRef<VideoView>(null)

  const { muted, updatePreferences } = usePreferences()

  const { styles, theme } = useStyles(stylesheet)

  const [playing, setPlaying] = useState(false)

  const [source, setSource] = useState<VideoSource>(() => {
    if (video.provider === 'reddit') {
      return video.url
    }

    return null
  })

  useEffect(() => {
    if (video.provider === 'redgifs') {
      void getGif(video.url).then((data) => {
        setSource(data.gif.urls.hd)
      })
    }
  }, [video.provider, video.url])

  const player = useVideoPlayer(source, (instance) => {
    instance.loop = true
    instance.muted = muted

    instance.play()
  })

  useEffect(() => {
    const subscription = player.addListener('playingChange', (isPlaying) => {
      setPlaying(isPlaying)
    })

    return () => {
      subscription.remove()
    }
  }, [player])

  const controls = [
    // {
    //   Icon: CornersOutIcon,
    //   key: 'fullscreen',
    //   onPress() {
    //     setFullscreen(true)

    //     ref.current?.enterFullscreen()
    //   },
    // },
    {
      Icon: muted ? SpeakerNoneIcon : SpeakerHighIcon,
      key: 'volume',
      onPress() {
        updatePreferences({
          muted: !muted,
        })
      },
    },
  ]

  return (
    <View style={styles.main(frame.width)}>
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
          <PlayIcon
            color={theme.colors.accent[9]}
            size={frame.width / 10}
            style={styles.play(frame.width, frame.width / 10)}
          />
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
            <control.Icon color={theme.colors.grayA[11]} size={20} />
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
  main: (height: number) => ({
    backgroundColor: theme.colors.grayA[2],
    height,
    width: height,
  }),
  play: (height: number, size: number) => ({
    alignSelf: 'center',
    position: 'absolute',
    top: height / 2 - size / 2,
  }),
  video: {
    flex: 1,
  },
}))
