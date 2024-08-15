import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { usePostVote } from '~/hooks/mutations/posts/vote'
import { type Post } from '~/types/post'

import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'

type Props = {
  post: Post
}

export function PostVoteCard({ post }: Props) {
  const { styles, theme } = useStyles(stylesheet)

  const { vote } = usePostVote()

  const color = theme.colors.gray[post.read ? 'a11' : 'a12']

  return (
    <>
      <Pressable
        onPress={() => {
          vote({
            direction: post.liked ? 0 : 1,
            postId: post.id,
          })
        }}
        style={[styles.main, post.liked && styles.liked]}
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
            postId: post.id,
          })
        }}
        style={[styles.main, post.liked === false && styles.unliked]}
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
  liked: {
    backgroundColor: theme.colors.green.a9,
  },
  main: {
    alignItems: 'center',
    borderCurve: 'continuous',
    borderRadius: theme.radius[3],
    height: theme.space[6],
    justifyContent: 'center',
    width: theme.space[6],
  },
  unliked: {
    backgroundColor: theme.colors.red.a9,
  },
}))
