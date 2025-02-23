import { type StyleProp, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Pressable } from '~/components/common/pressable'
import { Spinner } from '~/components/common/spinner'
import { View } from '~/components/common/view'
import { useRedGifs } from '~/hooks/redgifs'
import { type PostMedia } from '~/types/post'

import { VideoPlayer } from './player'

type Props = {
  compact?: boolean
  large?: boolean
  nsfw?: boolean
  onLongPress?: () => void
  recyclingKey?: string
  spoiler?: boolean
  style?: StyleProp<ViewStyle>
  video: PostMedia
  viewing: boolean
}

export function RedGifsVideo({
  compact,
  large,
  nsfw,
  onLongPress,
  recyclingKey,
  spoiler,
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
        large={large}
        nsfw={nsfw}
        onLongPress={onLongPress}
        recyclingKey={recyclingKey}
        source={gif.source}
        spoiler={spoiler}
        style={style}
        video={video}
        viewing={viewing}
      />
    )
  }

  return (
    <Pressable
      delayed
      onLongPress={onLongPress}
      style={styles.main(compact, large)}
    >
      <View
        align="center"
        justify="center"
        style={styles.video(video.width / video.height, compact)}
      >
        <Spinner />
      </View>
    </Pressable>
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  main: (compact?: boolean, large?: boolean) => {
    if (compact) {
      return {
        backgroundColor: theme.colors.gray.ui,
        borderCurve: 'continuous',
        borderRadius: theme.space[large ? 2 : 1],
        height: theme.space[8] * (large ? 2 : 1),
        overflow: 'hidden',
        width: theme.space[8] * (large ? 2 : 1),
      }
    }

    return {
      justifyContent: 'center',
      maxHeight: runtime.screen.height * 0.6,
      overflow: 'hidden',
    }
  },
  video: (aspectRatio: number, compact?: boolean) => ({
    aspectRatio: compact ? 1 : aspectRatio,
  }),
}))
