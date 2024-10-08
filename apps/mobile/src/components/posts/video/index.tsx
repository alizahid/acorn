import { type StyleProp, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { type PostMedia } from '~/types/post'

import { PostLinkCard } from '../link'
import { VideoPlayer } from './player'
import { RedGifsVideo } from './red-gifs'

type Props = {
  crossPost?: boolean
  nsfw?: boolean
  recyclingKey?: string
  style?: StyleProp<ViewStyle>
  video: PostMedia
  viewing: boolean
}

export function PostVideoCard({
  crossPost,
  nsfw,
  recyclingKey,
  style,
  video,
  viewing,
}: Props) {
  const { styles } = useStyles(stylesheet)

  if (video.provider === 'redgifs') {
    return (
      <RedGifsVideo
        crossPost={crossPost}
        nsfw={nsfw}
        style={style}
        video={video}
        viewing={viewing}
      />
    )
  }

  if (video.provider === 'reddit') {
    return (
      <VideoPlayer
        crossPost={crossPost}
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
    <PostLinkCard
      media={media}
      recyclingKey={recyclingKey}
      style={styles.link}
      url={video.url}
    />
  )
}

const stylesheet = createStyleSheet((theme) => ({
  link: {
    marginTop: theme.space[3],
  },
}))
