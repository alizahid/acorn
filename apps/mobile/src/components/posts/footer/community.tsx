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
}

export function PostCommunity({ label, post }: Props) {
  const router = useRouter()

  const { styles, theme } = useStyles(stylesheet)

  const image = label === 'subreddit' ? post.community.image : post.user.image

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

            return
          }

          router.navigate({
            params: {
              name: removePrefix(post.community.name),
            },
            pathname: '/communities/[name]',
          })

          return
        }

        router.navigate({
          params: {
            name: removePrefix(post.user.name),
          },
          pathname: '/users/[name]',
        })
      }}
      self="start"
    >
      {image ? <Image source={image} style={styles.image} /> : null}

      <Text lines={1} size="2" weight="medium">
        {label === 'subreddit' ? post.community.name : post.user.name}
      </Text>
    </Pressable>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  image: {
    backgroundColor: theme.colors.gray.ui,
    borderCurve: 'continuous',
    borderRadius: theme.space[4],
    height: theme.space[4],
    width: theme.space[4],
  },
}))
