import { type StyleProp, type ViewStyle } from 'react-native'

import { type PostMedia } from '~/types/post'

import { VideoPlayer } from './player'
import { RedGifsVideo } from './red-gifs'

type Props = {
  margin?: number
  style?: StyleProp<ViewStyle>
  video: PostMedia
  viewing: boolean
}

export function PostVideoCard({ margin = 0, style, video, viewing }: Props) {
  if (video.provider === 'redgifs') {
    return (
      <RedGifsVideo
        margin={margin}
        style={style}
        video={video}
        viewing={viewing}
      />
    )
  }

  return (
    <VideoPlayer
      margin={margin}
      source={video.url}
      style={style}
      video={video}
      viewing={viewing}
    />
  )
}
