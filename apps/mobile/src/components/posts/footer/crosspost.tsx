import { useRouter } from 'expo-router'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useFormatter, useTranslations } from 'use-intl'

import { Icon, type IconName } from '~/components/common/icon'
import { Pressable } from '~/components/common/pressable'
import { Text } from '~/components/common/text'
import { space } from '~/styles/tokens'
import { type Post } from '~/types/post'

type Props = {
  post: Post
}

export function CrossPostFooter({ post }: Props) {
  const router = useRouter()

  const a11y = useTranslations('a11y')
  const f = useFormatter()

  const footer = [
    {
      icon: (post.liked
        ? 'arrow-fat-up-fill'
        : post.liked === false
          ? 'arrow-fat-down-fill'
          : 'arrow-fat-up') satisfies IconName,
      key: 'votes',
      label: f.number(post.votes, {
        notation: 'compact',
      }),
    },
    {
      icon: 'chat-centered' satisfies IconName,
      key: 'comments',
      label: f.number(post.comments, {
        notation: 'compact',
      }),
    },
  ] as const

  return (
    <View style={styles.main}>
      <Pressable
        accessibilityHint={a11y('viewCommunity')}
        accessibilityLabel={post.community.name}
        hitSlop={space[4]}
        onPress={() => {
          router.navigate({
            params: {
              name: post.community.name,
            },
            pathname: '/communities/[name]',
          })
        }}
        style={styles.header}
      >
        <Icon
          name="shuffle"
          style={styles.crossPost}
          uniProps={(theme) => ({
            size: theme.typography[1].lineHeight,
          })}
        />

        <Text size="1" weight="medium">
          {post.community.name}
        </Text>
      </Pressable>

      {footer.map((item) => (
        <View key={item.key} style={styles.item}>
          <Icon
            name={item.icon}
            uniProps={(theme) => ({
              color: theme.colors.gray.textLow,
              size: theme.typography[1].lineHeight,
            })}
          />

          <Text highContrast={false} size="1" tabular>
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  crossPost: {
    transform: [
      {
        rotate: '-90deg',
      },
    ],
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.space[2],
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.space[1],
  },
  main: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.space[4],
  },
}))
