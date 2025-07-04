import { type StyleProp, type ViewStyle } from 'react-native'

import { type PostMedia } from '~/types/post'

import { PostLinkCard } from '../link'
import { VideoPlaceholder } from './placeholder'
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
  thumbnail?: string
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
  thumbnail,
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
        thumbnail={thumbnail}
        video={video}
        viewing={viewing}
      />
    )
  }

  if (video.provider === 'reddit') {
    return (
      <VideoPlaceholder
        compact={compact}
        large={large}
        nsfw={nsfw}
        spoiler={spoiler}
        thumbnail={thumbnail}
        video={video}
      >
        {viewing ? (
          <VideoPlayer
            compact={compact}
            large={large}
            nsfw={nsfw}
            recyclingKey={recyclingKey}
            source={video.url}
            spoiler={spoiler}
            style={style}
            thumbnail={thumbnail}
            video={video}
            viewing={viewing}
          />
        ) : null}
      </VideoPlaceholder>
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
