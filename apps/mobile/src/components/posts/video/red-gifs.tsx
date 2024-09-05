import { type StyleProp, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Spinner } from '~/components/common/spinner'
import { View } from '~/components/common/view'
import { useRedGifs } from '~/hooks/redgifs'
import { getAspectRatio } from '~/lib/media'
import { type PostMedia } from '~/types/post'

import { VideoPlayer } from './player'

type Props = {
  nsfw?: boolean
  style?: StyleProp<ViewStyle>
  video: PostMedia
  viewing: boolean
}

export function RedGifsVideo({ nsfw, style, video, viewing }: Props) {
  const { styles } = useStyles(stylesheet)

  const { gif } = useRedGifs(video.url)

  if (gif) {
    return (
      <VideoPlayer
        nsfw={nsfw}
        source={gif.source}
        style={style}
        video={video}
        viewing={viewing}
      />
    )
  }

  return (
    <View
      align="center"
      justify="center"
      style={styles.main(getAspectRatio(video))}
    >
      <Spinner />
    </View>
  )
}

const stylesheet = createStyleSheet(() => ({
  main: (aspectRatio: number) => ({
    aspectRatio,
  }),
}))
