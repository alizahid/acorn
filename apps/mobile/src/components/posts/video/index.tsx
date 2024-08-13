import { type StyleProp, type ViewStyle } from 'react-native'

import { type Post, type PostMedia } from '~/types/post'

import { VideoPlayer } from './player'
import { RedGifsVideo } from './red-gifs'

type Props = {
  margin?: number
  post: Post
  style?: StyleProp<ViewStyle>
  video: PostMedia
  viewing: boolean
}

export function PostVideoCard({
  margin = 0,
  post,
  style,
  video,
  viewing,
}: Props) {
  if (video.provider === 'redgifs') {
    return (
      <RedGifsVideo
        margin={margin}
        post={post}
        style={style}
        video={video}
        viewing={viewing}
      />
    )
  }

  return (
    <VideoPlayer
      margin={margin}
      post={post}
      source={video.url}
      style={style}
      video={video}
      viewing={viewing}
    />
  )
}
