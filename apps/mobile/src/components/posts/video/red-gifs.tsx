import { useEffect } from 'react'
import { type StyleProp, View, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Spinner } from '~/components/common/spinner'
import { useCommon } from '~/hooks/common'
import { useRedGifs } from '~/hooks/redgifs'
import { getDimensions } from '~/lib/media'
import { type PostMedia } from '~/types/post'

import { VideoPlayer } from './player'

type Props = {
  margin?: number
  style?: StyleProp<ViewStyle>
  video: PostMedia
  viewing: boolean
}

export function RedGifsVideo({ margin = 0, style, video, viewing }: Props) {
  const common = useCommon()

  const { styles } = useStyles(stylesheet)

  const { get, source } = useRedGifs(video.url)

  useEffect(() => {
    get({
      id: video.url,
    })
  }, [get, video.url])

  if (source) {
    return (
      <VideoPlayer
        margin={margin}
        source={source}
        style={style}
        video={video}
        viewing={viewing}
      />
    )
  }

  const frameWidth = common.frame.width - margin

  const dimensions = getDimensions(frameWidth, video)

  return (
    <View
      style={styles.main(common.maxHeight, dimensions.height, dimensions.width)}
    >
      <Spinner />
    </View>
  )
}

const stylesheet = createStyleSheet(() => ({
  main: (maxHeight: number, height: number, width: number) => ({
    alignItems: 'center',
    height: Math.min(maxHeight, height),
    justifyContent: 'center',
    width,
  }),
}))
