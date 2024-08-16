import { type StyleProp, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Spinner } from '~/components/common/spinner'
import { View } from '~/components/common/view'
import { useCommon } from '~/hooks/common'
import { useRedGifs } from '~/hooks/redgifs'
import { getDimensions } from '~/lib/media'
import { type PostMedia } from '~/types/post'

import { VideoPlayer } from './player'

type Props = {
  margin?: number
  nsfw?: boolean
  style?: StyleProp<ViewStyle>
  video: PostMedia
  viewing: boolean
}

export function RedGifsVideo({
  margin = 0,
  nsfw,
  style,
  video,
  viewing,
}: Props) {
  const common = useCommon()

  const { styles } = useStyles(stylesheet)

  const { gif } = useRedGifs(video.url)

  if (gif) {
    return (
      <VideoPlayer
        margin={margin}
        nsfw={nsfw}
        source={gif.source}
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
      align="center"
      justify="center"
      style={styles.main(
        common.height.max,
        dimensions.height,
        dimensions.width,
      )}
    >
      <Spinner />
    </View>
  )
}

const stylesheet = createStyleSheet(() => ({
  main: (maxHeight: number, height: number, width: number) => ({
    height: Math.min(maxHeight, height),
    width,
  }),
}))
