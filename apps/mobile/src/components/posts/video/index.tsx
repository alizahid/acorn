import { View } from '~/components/common/view'
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
        {compact ? null : (
          <VideoPlayer
            nsfw={nsfw}
            recyclingKey={recyclingKey}
            spoiler={spoiler}
            thumbnail={thumbnail}
            video={video}
            viewing={viewing}
          />
        )}
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
    <View mx={crossPost ? '3' : undefined}>
      <PostLinkCard
        compact={compact}
        crossPost={crossPost}
        large={large}
        media={media}
        recyclingKey={recyclingKey}
        url={video.url}
      />
    </View>
  )
}
