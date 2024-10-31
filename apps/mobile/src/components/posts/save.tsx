import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { usePostSave } from '~/hooks/mutations/posts/save'
import { type Post } from '~/types/post'

import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'

type Props = {
  post: Post
  seen?: boolean
}

export function PostSaveCard({ post, seen }: Props) {
  const { styles, theme } = useStyles(stylesheet)

  const { save } = usePostSave()

  return (
    <Pressable
      align="center"
      height="6"
      justify="center"
      onPress={() => {
        save({
          action: post.saved ? 'unsave' : 'save',
          postId: post.id,
        })
      }}
      style={[styles.main, post.saved && styles.saved]}
      width="6"
    >
      <Icon
        color={
          theme.colors[post.saved ? 'white' : 'gray'][seen ? 'a11' : 'a12']
        }
        name="BookmarkSimple"
        size={theme.space[5]}
        weight={post.saved ? 'fill' : 'bold'}
      />
    </Pressable>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: {
    borderCurve: 'continuous',
    borderRadius: theme.radius[3],
  },
  saved: {
    backgroundColor: theme.colors.green.a9,
  },
}))
