import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Pressable } from '~/components/common/pressable'
import { Text } from '~/components/common/text'
import { View } from '~/components/common/view'
import { removePrefix } from '~/lib/reddit'
import { type Post } from '~/types/post'

export type PostLabel = 'user' | 'subreddit' | 'both'

type Props = {
  label?: PostLabel
  post: Post
}

export function PostCommunity({ label, post }: Props) {
  const router = useRouter()

  const t = useTranslations('component.posts.community')

  const { styles, theme } = useStyles(stylesheet)

  const image = label === 'subreddit' ? post.community.image : post.user.image

  if (label === 'both') {
    return (
      <View direction="row" flex={1} gap="1" style={styles.main}>
        <Pressable
          align="center"
          direction="row"
          gap="2"
          hitSlop={theme.space[3]}
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
        >
          {post.community.image ? (
            <Image source={post.community.image} style={styles.image} />
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
          gap="2"
          hitSlop={theme.space[3]}
          onPress={() => {
            router.navigate({
              params: {
                name: removePrefix(post.user.name),
              },
              pathname: '/users/[name]',
            })
          }}
          style={styles.user(post.community.name)}
        >
          {post.user.image ? (
            <Image source={post.user.image} style={styles.image} />
          ) : null}

          <Text lines={1} size="2" weight="medium">
            {post.user.name}
          </Text>
        </Pressable>
      </View>
    )
  }

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

const stylesheet = createStyleSheet((theme, runtime) => ({
  image: {
    backgroundColor: theme.colors.gray.ui,
    borderCurve: 'continuous',
    borderRadius: theme.space[4],
    height: theme.space[4],
    width: theme.space[4],
  },
  main: {
    maxWidth: runtime.screen.width - 148,
    overflow: 'hidden',
  },
  user: (community: string) => ({
    maxWidth: runtime.screen.width - 192 - community.length * 9,
    overflow: 'hidden',
  }),
}))
