import { MediaMenu } from '~/components/common/media-menu'
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
  thumbnail?: string
  video: PostMedia
}

export function PostVideoCard({
  compact,
  crossPost,
  large,
  nsfw,
  recyclingKey,
  spoiler,
  thumbnail,
  video,
}: Props) {
  if (video.provider === 'red-gifs') {
    return (
      <RedGifsVideo
        compact={compact}
        crossPost={crossPost}
        large={large}
        nsfw={nsfw}
        recyclingKey={recyclingKey}
        spoiler={spoiler}
        thumbnail={thumbnail}
        video={video}
      />
    )
  }

  if (video.provider === 'reddit') {
    return (
      <VideoPlayer
        compact={compact}
        crossPost={crossPost}
        large={large}
        nsfw={nsfw}
        poster={thumbnail ?? video.thumbnail}
        recyclingKey={recyclingKey}
        spoiler={spoiler}
        video={video}
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
      onLongPress={() => {
        MediaMenu.call({
          type: 'link',
          url: video.url,
        })
      }}
      recyclingKey={recyclingKey}
      url={video.url}
    />
  )
}
