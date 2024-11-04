import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Pressable } from '~/components/common/pressable'
import { Text } from '~/components/common/text'
import { removePrefix } from '~/lib/reddit'
import { type Post } from '~/types/post'

export type PostLabel = 'user' | 'subreddit'

type Props = {
  label?: PostLabel
  post: Post
  seen?: boolean
}

export function PostCommunity({ label, post, seen }: Props) {
  const router = useRouter()

  const { styles, theme } = useStyles(stylesheet)

  return (
    <Pressable
      align="center"
      direction="row"
      gap="2"
      hitSlop={theme.space[3]}
      onPress={() => {
        if (label === 'subreddit') {
          if (post.community.name.startsWith('u/')) {
            router.navigate({
              params: {
                name: removePrefix(post.community.name),
              },
              pathname: '/users/[name]',
            })
          } else {
            router.navigate({
              params: {
                name: removePrefix(post.community.name),
              },
              pathname: '/communities/[name]',
            })
          }
        } else {
          router.navigate({
            params: {
              name: removePrefix(post.user.name),
            },
            pathname: '/users/[name]',
          })
        }
      }}
    >
      {label === 'subreddit' && post.community.image ? (
        <Image source={post.community.image} style={styles.image} />
      ) : null}

      <Text highContrast={!seen} lines={1} size="2" weight="medium">
        {label === 'subreddit' ? post.community.name : post.user.name}
      </Text>
    </Pressable>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  image: {
    backgroundColor: theme.colors.gray.a3,
    borderCurve: 'continuous',
    borderRadius: theme.typography[2].lineHeight,
    height: theme.typography[2].lineHeight,
    width: theme.typography[2].lineHeight,
  },
}))