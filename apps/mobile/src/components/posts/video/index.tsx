import { type StyleProp, type ViewStyle } from 'react-native'

import { type PostMedia } from '~/types/post'

import { VideoPlayer } from './player'
import { RedGifsVideo } from './red-gifs'

type Props = {
  margin?: number
  nsfw?: boolean
  style?: StyleProp<ViewStyle>
  video: PostMedia
  viewing: boolean
}

export function PostVideoCard({
  margin = 0,
  nsfw,
  style,
  video,
  viewing,
}: Props) {
  if (video.provider === 'redgifs') {
    return (
      <RedGifsVideo
        margin={margin}
        nsfw={nsfw}
        style={style}
        video={video}
        viewing={viewing}
      />
    )
  }

  return (
    <VideoPlayer
      margin={margin}
      nsfw={nsfw}
      source={video.url}
      style={style}
      video={video}
      viewing={viewing}
    />
  )
}
