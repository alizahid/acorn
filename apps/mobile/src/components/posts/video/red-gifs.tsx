import { type StyleProp, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Spinner } from '~/components/common/spinner'
import { View } from '~/components/common/view'
import { useRedGifs } from '~/hooks/redgifs'
import { type PostMedia } from '~/types/post'

import { VideoPlayer } from './player'

type Props = {
  crossPost?: boolean
  nsfw?: boolean
  style?: StyleProp<ViewStyle>
  video: PostMedia
  viewing: boolean
}

export function RedGifsVideo({
  crossPost,
  nsfw,
  style,
  video,
  viewing,
}: Props) {
  const { styles } = useStyles(stylesheet)

  const { gif } = useRedGifs(video.url)

  if (gif) {
    return (
      <VideoPlayer
        crossPost={crossPost}
        nsfw={nsfw}
        source={gif.source}
        style={style}
        video={video}
        viewing={viewing}
      />
    )
  }

  return (
    <View style={styles.main(crossPost)}>
      <View
        align="center"
        justify="center"
        style={styles.video(video.width / video.height)}
      >
        <Spinner />
      </View>
    </View>
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  main: (crossPost?: boolean) => ({
    justifyContent: 'center',
    maxHeight: runtime.screen.height * (crossPost ? 0.3 : 0.5),
    overflow: 'hidden',
  }),
  video: (aspectRatio: number) => ({
    aspectRatio,
  }),
}))
