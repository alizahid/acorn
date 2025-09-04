import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Pressable } from '~/components/common/pressable'
import { Text } from '~/components/common/text'
import { View } from '~/components/common/view'
import { removePrefix } from '~/lib/reddit'
import { space } from '~/styles/tokens'
import { type Post } from '~/types/post'

type Props = {
  post: Post
}

export function PostCommunity({ post }: Props) {
  const router = useRouter()

  const t = useTranslations('component.posts.community')

  return (
    <View direction="row" flexShrink={1} gap="1">
      <Pressable
        align="center"
        direction="row"
        gap="2"
        hitSlop={space[3]}
        label={post.community.name}
        onPress={() => {
          if (post.community.name.startsWith('u/')) {
            router.push({
              params: {
                name: removePrefix(post.community.name),
              },
              pathname: '/users/[name]',
            })

            return
          }

          router.push({
            params: {
              name: removePrefix(post.community.name),
            },
            pathname: '/communities/[name]',
          })
        }}
      >
        {post.community.image ? (
          <Image
            accessibilityIgnoresInvertColors
            source={post.community.image}
            style={styles.image}
          />
        ) : null}

        <Text lines={1} size="2" weight="medium">
          {post.community.name}
        </Text>
      </Pressable>

      <Text highContrast={false} size="2">
        {t('by')}
      </Text>

      <Pressable
        align="center"
        direction="row"
        flexShrink={1}
        gap="2"
        hitSlop={space[3]}
        label={post.user.name}
        onPress={() => {
          router.push({
            params: {
              name: removePrefix(post.user.name),
            },
            pathname: '/users/[name]',
          })
        }}
      >
        <Text lines={1} size="2" weight="medium">
          {post.user.name}
        </Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  image: {
    backgroundColor: theme.colors.gray.ui,
    borderCurve: 'continuous',
    borderRadius: theme.space[4],
    height: theme.space[4],
    width: theme.space[4],
  },
}))
