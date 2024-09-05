import { type StyleProp, type ViewStyle } from 'react-native'

import { type PostMedia } from '~/types/post'

import { PostLinkCard } from '../link'
import { VideoPlayer } from './player'
import { RedGifsVideo } from './red-gifs'

type Props = {
  nsfw?: boolean
  recyclingKey?: string
  style?: StyleProp<ViewStyle>
  video: PostMedia
  viewing: boolean
}

export function PostVideoCard({
  nsfw,
  recyclingKey,
  style,
  video,
  viewing,
}: Props) {
  if (video.provider === 'redgifs') {
    return (
      <RedGifsVideo nsfw={nsfw} style={style} video={video} viewing={viewing} />
    )
  }

  if (video.provider === 'reddit') {
    return (
      <VideoPlayer
        nsfw={nsfw}
        source={video.url}
        style={style}
        video={video}
        viewing={viewing}
      />
    )
  }

  const media = video.thumbnail
    ? {
        ...video,
        url: video.thumbnail,
      }
    : undefined

  return (
    <PostLinkCard media={media} recyclingKey={recyclingKey} url={video.url} />
  )
}
