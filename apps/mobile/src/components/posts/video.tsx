import { useVideoPlayer, type VideoSource, VideoView } from 'expo-video'
import { useEffect, useRef, useState } from 'react'
import { Pressable as ReactNativePressable, View } from 'react-native'
import SpeakerHighIcon from 'react-native-phosphor/src/duotone/SpeakerHigh'
import SpeakerNoneIcon from 'react-native-phosphor/src/duotone/SpeakerNone'
import PlayIcon from 'react-native-phosphor/src/fill/Play'
import { useSafeAreaFrame } from 'react-native-safe-area-context'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { getDimensions } from '~/lib/media'
import { getGif } from '~/lib/red-gifs'
import { usePreferences } from '~/stores/preferences'
import { type PostVideo } from '~/types/post'

import { Pressable } from '../common/pressable'
import { Spinner } from '../common/spinner'

type Props = {
  margin?: number
  video: PostVideo
  viewing: boolean
}

export function PostVideo({ margin = 0, video, viewing }: Props) {
  const frame = useSafeAreaFrame()

  const ref = useRef<VideoView>(null)

  const { muted, updatePreferences } = usePreferences()

  const { styles, theme } = useStyles(stylesheet)

  const [playing, setPlaying] = useState(false)
  const [sound, setSound] = useState(false)

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

      player.muted = next

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
      Icon: sound ? SpeakerHighIcon : SpeakerNoneIcon,
      key: 'volume',
      onPress() {
        updatePreferences({
          muted: !muted,
        })
      },
    },
  ]

  const height = getDimensions(frame.width, video)

  return (
    <View style={styles.main(margin, height, frame.width)}>
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

        {!playing || player.status === 'loading' ? (
          <View style={styles.play}>
            {player.status === 'loading' ? (
              <Spinner />
            ) : !playing ? (
              <PlayIcon color={theme.colors.accent[9]} size={frame.width / 8} />
            ) : null}
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
  main: (margin: number, height: number, width: number) => ({
    backgroundColor: theme.colors.grayA[2],
    height,
    marginHorizontal: -margin,
    marginVertical: theme.space[2],
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
