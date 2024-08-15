import { Share } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { type Post } from '~/types/post'

import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'

type Props = {
  post: Post
}

export function PostShareCard({ post }: Props) {
  const { styles, theme } = useStyles(stylesheet)

  return (
    <Pressable
      onPress={() => {
        const url = new URL(post.permalink, 'https://reddit.com')

        void Share.share({
          message: post.title,
          url: url.toString(),
        })
      }}
      style={styles.main}
    >
      <Icon
        color={theme.colors.gray[post.read ? 'a11' : 'a12']}
        name="ShareFat"
        size={theme.space[5]}
        weight="duotone"
      />
    </Pressable>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: {
    alignItems: 'center',
    borderCurve: 'continuous',
    borderRadius: theme.radius[3],
    height: theme.space[6],
    justifyContent: 'center',
    width: theme.space[6],
  },
}))
