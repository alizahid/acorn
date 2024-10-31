import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { usePostVote } from '~/hooks/mutations/posts/vote'
import { type Post } from '~/types/post'

import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'

type Props = {
  expanded?: boolean
  post: Post
  seen?: boolean
}

export function PostVoteCard({ expanded = false, post, seen }: Props) {
  const { styles, theme } = useStyles(stylesheet)

  const { vote } = usePostVote()

  return (
    <>
      {expanded || post.liked !== false ? (
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
            color={
              theme.colors[post.liked ? 'white' : 'gray'][seen ? 'a11' : 'a12']
            }
            name="ArrowUp"
            size={theme.space[5]}
            weight="bold"
          />
        </Pressable>
      ) : null}

      {expanded || post.liked === false ? (
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
            color={
              theme.colors[post.liked === false ? 'white' : 'gray'][
                seen ? 'a11' : 'a12'
              ]
            }
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
    backgroundColor: theme.colors.orange.a9,
  },
  main: {
    borderCurve: 'continuous',
    borderRadius: theme.radius[3],
  },
  unliked: {
    backgroundColor: theme.colors.violet.a9,
  },
}))
