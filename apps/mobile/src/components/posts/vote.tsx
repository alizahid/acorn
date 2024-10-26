import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { usePostVote } from '~/hooks/mutations/posts/vote'
import { type Post } from '~/types/post'

import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'

type Props = {
  expanded: boolean
  post: Post
}

export function PostVoteCard({ expanded, post }: Props) {
  const { styles, theme } = useStyles(stylesheet)

  const { vote } = usePostVote()

  return (
    <>
      <Pressable
        align="center"
        height="6"
        justify="center"
        onPress={() => {
          vote({
            direction: post.liked ? 0 : 1,
            postId: post.id,
          })
        }}
        style={[styles.main, post.liked && styles.liked]}
        width="6"
      >
        <Icon
          color={theme.colors[post.liked ? 'white' : 'gray'].a12}
          name="ArrowUp"
          size={theme.space[5]}
          weight="bold"
        />
      </Pressable>

      {expanded ? (
        <Pressable
          align="center"
          height="6"
          justify="center"
          onPress={() => {
            vote({
              direction: post.liked === false ? 0 : -1,
              postId: post.id,
            })
          }}
          style={[styles.main, post.liked === false && styles.unliked]}
          width="6"
        >
          <Icon
            color={theme.colors[post.liked === false ? 'white' : 'gray'].a12}
            name="ArrowDown"
            size={theme.space[5]}
            weight="bold"
          />
        </Pressable>
      ) : null}
    </>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  liked: {
    backgroundColor: theme.colors.green.a9,
  },
  main: {
    borderCurve: 'continuous',
    borderRadius: theme.radius[3],
  },
  unliked: {
    backgroundColor: theme.colors.red.a9,
  },
}))
