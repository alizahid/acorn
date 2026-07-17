import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { removePrefix } from '~/lib/reddit'
import { type Post } from '~/types/post'

import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { GlassView } from '../native/glass-view'

type Props = {
  post: Post
}

export function CommunityHeader({ post }: Props) {
  const router = useRouter()

  const a11y = useTranslations('a11y')

  return (
    <GlassView isInteractive style={styles.main}>
      <Pressable
        accessibilityHint={a11y('viewCommunity')}
        accessibilityLabel={post.community.name}
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
        style={styles.content}
      >
        {post.community.image ? (
          <Image source={post.community.image} style={styles.image} />
        ) : null}

        <Text numberOfLines={1} style={styles.name} weight="bold">
          {post.community.name}
        </Text>
      </Pressable>
    </GlassView>
  )
}
const styles = StyleSheet.create((theme) => ({
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.space[1],
    height: theme.space[8],
    paddingHorizontal: theme.space[4],
  },
  image: {
    borderCurve: 'continuous',
    borderRadius: theme.typography[3].lineHeight,
    height: theme.typography[3].lineHeight,
    width: theme.typography[3].lineHeight,
  },

  main: {
    borderCurve: 'continuous',
    borderRadius: theme.space[8],
  },
  name: {
    flexShrink: 1,
  },
}))
