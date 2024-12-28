import { type StyleProp, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Spinner } from '~/components/common/spinner'
import { View } from '~/components/common/view'
import { useRedGifs } from '~/hooks/redgifs'
import { type PostMedia } from '~/types/post'

import { VideoPlayer } from './player'

type Props = {
  compact?: boolean
  crossPost?: boolean
  large?: boolean
  nsfw?: boolean
  recyclingKey?: string
  style?: StyleProp<ViewStyle>
  video: PostMedia
  viewing: boolean
}

export function RedGifsVideo({
  compact,
  crossPost,
  large,
  nsfw,
  recyclingKey,
  style,
  video,
  viewing,
}: Props) {
  const { styles } = useStyles(stylesheet)

  const { gif } = useRedGifs(video.url)

  if (gif) {
    return (
      <VideoPlayer
        compact={compact}
        crossPost={crossPost}
        large={large}
        nsfw={nsfw}
        recyclingKey={recyclingKey}
        source={gif.source}
        style={style}
        video={video}
        viewing={viewing}
      />
    )
  }

  return (
    <View style={styles.main(crossPost, compact, large)}>
      <View
        align="center"
        justify="center"
        style={styles.video(video.width / video.height, compact)}
      >
        <Spinner />
      </View>
    </View>
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  main: (crossPost?: boolean, compact?: boolean, large?: boolean) => {
    if (compact) {
      return {
        backgroundColor: theme.colors.gray.a3,
        borderCurve: 'continuous',
        borderRadius: theme.space[large ? 2 : 1],
        height: theme.space[8] * (large ? 2 : 1),
        overflow: 'hidden',
        width: theme.space[8] * (large ? 2 : 1),
      }
    }

    return {
      justifyContent: 'center',
      maxHeight: runtime.screen.height * (crossPost ? 0.4 : 0.8),
      overflow: 'hidden',
    }
  },
  video: (aspectRatio: number, compact?: boolean) => ({
    aspectRatio: compact ? 1 : aspectRatio,
  }),
}))
