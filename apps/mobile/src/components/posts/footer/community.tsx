import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Pressable } from '~/components/common/pressable'
import { Text } from '~/components/common/text'
import { removePrefix } from '~/lib/reddit'
import { space } from '~/styles/tokens'
import { type Post } from '~/types/post'

type Props = {
  post: Post
}

export function PostCommunity({ post }: Props) {
  const router = useRouter()

  const t = useTranslations('component.posts.community')
  const a11y = useTranslations('a11y')

  return (
    <View style={styles.main}>
      <Pressable
        accessibilityHint={a11y('viewCommunity')}
        accessibilityLabel={post.community.name}
        hitSlop={space[3]}
        onPress={() => {
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
        }}
        style={styles.community}
      >
        {post.community.image ? (
          <Image
            accessibilityIgnoresInvertColors
            source={post.community.image}
            style={styles.image}
          />
        ) : null}

        <Text numberOfLines={1} size="2" style={styles.text} weight="medium">
          {post.community.name}
        </Text>
      </Pressable>

      <Text highContrast={false} size="2">
        {t('by')}
      </Text>

      <Pressable
        accessibilityHint={a11y('viewUser')}
        accessibilityLabel={post.user.name}
        hitSlop={space[3]}
        onPress={() => {
          router.navigate({
            params: {
              name: removePrefix(post.user.name),
            },
            pathname: '/users/[name]',
          })
        }}
        style={styles.text}
      >
        <Text numberOfLines={1} size="2" weight="medium">
          {post.user.name}
        </Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  community: {
    flexDirection: 'row',
    gap: theme.space[2],
  },
  image: {
    backgroundColor: theme.colors.gray.ui,
    borderCurve: 'continuous',
    borderRadius: theme.typography[2].lineHeight,
    height: theme.typography[2].lineHeight,
    width: theme.typography[2].lineHeight,
  },
  main: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.space[1],
  },
  text: {
    flexShrink: 1,
  },
}))
