import ArrowFatDownIcon from 'react-native-phosphor/src/duotone/ArrowFatDown'
import ArrowFatUpIcon from 'react-native-phosphor/src/duotone/ArrowFatUp'
import ArrowFatDownFillIcon from 'react-native-phosphor/src/fill/ArrowFatDown'
import ArrowFatUpFillIcon from 'react-native-phosphor/src/fill/ArrowFatUp'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { usePostVote } from '~/hooks/mutations/posts/vote'
import { type FeedType } from '~/hooks/queries/posts/posts'
import { type Post } from '~/types/post'

import { Pressable } from '../common/pressable'

type Props = {
  feedType?: FeedType
  post: Post
  subreddit?: string
}

export function PostVoteCard({ feedType, post, subreddit }: Props) {
  const { styles, theme } = useStyles(stylesheet)

  const { vote } = usePostVote()

  const Up = post.liked ? ArrowFatUpFillIcon : ArrowFatUpIcon
  const Down = post.liked === false ? ArrowFatDownFillIcon : ArrowFatDownIcon

  const color = theme.colors.grayA[post.read ? 11 : 12]

  return (
    <>
      <Pressable
        hitSlop={theme.space[4]}
        onPress={() => {
          vote({
            direction: post.liked ? 0 : 1,
            feedType,
            postId: post.id,
            subreddit,
          })
        }}
        style={[styles.action, post.liked && styles.liked]}
      >
        <Up
          color={post.liked ? theme.colors.white[12] : color}
          size={theme.typography[2].lineHeight}
        />
      </Pressable>

      <Pressable
        hitSlop={theme.space[4]}
        onPress={() => {
          vote({
            direction: post.liked === false ? 0 : -1,
            feedType,
            postId: post.id,
            subreddit,
          })
        }}
        style={[styles.action, post.liked === false && styles.unliked]}
      >
        <Down
          color={post.liked === false ? theme.colors.white[12] : color}
          size={theme.typography[2].lineHeight}
        />
      </Pressable>
    </>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  action: {
    alignItems: 'center',
    borderRadius: theme.radius[3],
    height: theme.space[6],
    justifyContent: 'center',
    width: theme.space[6],
  },
  liked: {
    backgroundColor: theme.colors.greenA[9],
  },
  unliked: {
    backgroundColor: theme.colors.redA[9],
  },
}))
