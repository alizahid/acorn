import { type StyleProp, type ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { Spinner } from '~/components/common/spinner'
import { View } from '~/components/common/view'
import { useRedGifs } from '~/hooks/red-gifs'
import { type PostMedia } from '~/types/post'

import { VideoPlaceholder } from './placeholder'
import { VideoPlayer } from './player'

type Props = {
  compact?: boolean
  large?: boolean
  nsfw?: boolean
  recyclingKey?: string
  spoiler?: boolean
  style?: StyleProp<ViewStyle>
  thumbnail?: string
  video: PostMedia
  viewing: boolean
  visible?: boolean
}

export function RedGifsVideo({
  compact,
  large,
  nsfw,
  recyclingKey,
  spoiler,
  style,
  thumbnail,
  video,
  viewing,
  visible,
}: Props) {
  styles.useVariants({
    compact,
    large,
  })

  const { gif } = useRedGifs(video.url)

  if (gif) {
    return (
      <VideoPlaceholder
        compact={compact}
        large={large}
        nsfw={nsfw}
        source={gif.source}
        spoiler={spoiler}
        thumbnail={thumbnail}
        video={video}
      >
        {!compact && visible ? (
          <VideoPlayer
            nsfw={nsfw}
            recyclingKey={recyclingKey}
            spoiler={spoiler}
            style={style}
            thumbnail={thumbnail}
            video={{
              ...video,
              url: gif.url,
            }}
            viewing={viewing}
          />
        ) : null}
      </VideoPlaceholder>
    )
  }

  return (
    <View style={styles.main}>
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

const styles = StyleSheet.create((theme, runtime) => ({
  main: {
    compoundVariants: [
      {
        compact: true,
        large: true,
        styles: {
          borderRadius: theme.space[2],
          height: theme.space[8] * 2,
          width: theme.space[8] * 2,
        },
      },
    ],
    justifyContent: 'center',
    maxHeight: runtime.screen.height * 0.6,
    overflow: 'hidden',
    variants: {
      compact: {
        true: {
          backgroundColor: theme.colors.gray.ui,
          borderCurve: 'continuous',
          borderRadius: theme.space[1],
          height: theme.space[8],
          overflow: 'hidden',
          width: theme.space[8],
        },
      },
      large: {
        true: {},
      },
    },
  },
  video: (aspectRatio: number, compact?: boolean) => ({
    aspectRatio: compact ? 1 : aspectRatio,
  }),
}))
