import { Share } from 'react-native'
import { useStyles } from 'react-native-unistyles'

import { type Post } from '~/types/post'

import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'

type Props = {
  post: Post
  seen?: boolean
}

export function PostShareCard({ post, seen }: Props) {
  const { theme } = useStyles()

  return (
    <Pressable
      align="center"
      height="6"
      justify="center"
      onPress={() => {
        const url = new URL(post.permalink, 'https://reddit.com')

        void Share.share({
          message: `${post.title} ${url.toString()}`,
        })
      }}
      width="6"
    >
      <Icon
        color={theme.colors.gray[seen ? 'a11' : 'a12']}
        name="Share"
        size={theme.space[5]}
        weight="bold"
      />
    </Pressable>
  )
}
