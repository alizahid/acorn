import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { usePostVote } from '~/hooks/mutations/posts/vote'
import { type FeedType } from '~/hooks/queries/posts/posts'
import { type Post } from '~/types/post'

import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'

type Props = {
  feedType?: FeedType
  post: Post
  subreddit?: string
}

export function PostVoteCard({ feedType, post, subreddit }: Props) {
  const { styles, theme } = useStyles(stylesheet)

  const { vote } = usePostVote()

  const color = theme.colors.gray[post.read ? 'a11' : 'a12']

  return (
    <>
      <Pressable
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
        <Icon
          color={post.liked ? theme.colors.white.a12 : color}
          name="ArrowUp"
          size={theme.space[5]}
          weight="bold"
        />
      </Pressable>

      <Pressable
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
        <Icon
          color={post.liked === false ? theme.colors.white.a12 : color}
          name="ArrowDown"
          size={theme.space[5]}
          weight="bold"
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
    backgroundColor: theme.colors.green.a9,
  },
  unliked: {
    backgroundColor: theme.colors.red.a9,
  },
}))
