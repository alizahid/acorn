import { type StyleProp, type ViewStyle } from 'react-native'

import { type PostMedia } from '~/types/post'

import { PostLinkCard } from '../link'
import { VideoPlayer } from './player'
import { RedGifsVideo } from './red-gifs'

type Props = {
  compact?: boolean
  crossPost?: boolean
  large?: boolean
  nsfw?: boolean
  recyclingKey?: string
  spoiler?: boolean
  style?: StyleProp<ViewStyle>
  video: PostMedia
  viewing: boolean
}

export function PostVideoCard({
  compact,
  crossPost,
  large,
  nsfw,
  recyclingKey,
  spoiler,
  style,
  video,
  viewing,
}: Props) {
  if (video.provider === 'red-gifs') {
    return (
      <RedGifsVideo
        compact={compact}
        large={large}
        nsfw={nsfw}
        recyclingKey={recyclingKey}
        spoiler={spoiler}
        style={style}
        video={video}
        viewing={viewing}
      />
    )
  }

  if (video.provider === 'reddit') {
    return (
      <VideoPlayer
        compact={compact}
        large={large}
        nsfw={nsfw}
        recyclingKey={recyclingKey}
        source={video.url}
        spoiler={spoiler}
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
    <PostLinkCard
      compact={compact}
      crossPost={crossPost}
      large={large}
      media={media}
      recyclingKey={recyclingKey}
      style={style}
      url={video.url}
    />
  )
}
