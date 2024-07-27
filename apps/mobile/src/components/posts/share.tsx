import ShareFatIcon from 'react-native-phosphor/src/duotone/ShareFat'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { type Post } from '~/types/post'

import { Pressable } from '../common/pressable'

type Props = {
  post: Post
}

export function PostShareCard({ post }: Props) {
  const { styles, theme } = useStyles(stylesheet)

  return (
    <Pressable
      onPress={() => {
        //
      }}
      style={styles.main}
    >
      <ShareFatIcon
        color={theme.colors.grayA[post.read ? 11 : 12]}
        size={theme.typography[2].lineHeight}
      />
    </Pressable>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: {
    alignItems: 'center',
    borderRadius: theme.radius[3],
    height: theme.space[6],
    justifyContent: 'center',
    width: theme.space[6],
  },
}))
