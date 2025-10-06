import { useRouter } from 'expo-router'
import { type SFSymbol } from 'expo-symbols'
import { StyleSheet } from 'react-native-unistyles'
import { useFormatter, useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { Pressable } from '~/components/common/pressable'
import { Text } from '~/components/common/text'
import { View } from '~/components/common/view'
import { getIcon } from '~/lib/icons'
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
      icon: getIcon(
        post.liked
          ? 'upvote.fill'
          : post.liked === false
            ? 'downvote.fill'
            : 'upvote',
      ) satisfies SFSymbol,
      key: 'votes',
      label: f.number(post.votes, {
        notation: 'compact',
      }),
    },
    {
      icon: 'bubble.left' satisfies SFSymbol,
      key: 'comments',
      label: f.number(post.comments, {
        notation: 'compact',
      }),
    },
  ] as const

  return (
    <View align="center" direction="row" gap="4">
      <Pressable
        accessibilityHint={a11y('viewCommunity')}
        accessibilityLabel={post.community.name}
        align="center"
        direction="row"
        gap="2"
        hitSlop={space[4]}
        onPress={() => {
          router.navigate({
            params: {
              name: post.community.name,
            },
            pathname: '/communities/[name]',
          })
        }}
      >
        <Icon
          name="arrow.trianglehead.branch"
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
        <View align="center" direction="row" gap="1" key={item.key}>
          <Icon
            name={item.icon}
            uniProps={(theme) => ({
              size: theme.typography[1].lineHeight,
              tintColor: theme.colors.gray.textLow,
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

const styles = StyleSheet.create({
  crossPost: {
    transform: [
      {
        rotate: '-90deg',
      },
    ],
  },
})
