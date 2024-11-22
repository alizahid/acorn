import { useRouter } from 'expo-router'
import { Share } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useFormatter } from 'use-intl'

import { useCommentVote } from '~/hooks/mutations/comments/vote'
import { withoutAgo } from '~/lib/intl'
import { removePrefix } from '~/lib/reddit'
import { type CommentReply } from '~/types/comment'

import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { View } from '../common/view'
import { FlairCard } from '../posts/flair'
import { FooterButton } from '../posts/footer/button'

type Props = {
  collapsed?: boolean
  comment: CommentReply
}

export function CommentMeta({ collapsed, comment }: Props) {
  const router = useRouter()

  const f = useFormatter()

  const { styles, theme } = useStyles(stylesheet)

  const { vote } = useCommentVote()

  return (
    <View
      align="center"
      direction="row"
      gap="3"
      mb="3"
      mt={collapsed ? '3' : undefined}
      mx="3"
    >
      {comment.sticky ? (
        <Icon
          color={theme.colors.red.a9}
          name="PushPin"
          size={theme.space[4]}
          style={styles.sticky}
          weight="fill"
        />
      ) : null}

      <Pressable
        align="center"
        direction="row"
        flexShrink={1}
        gap="1"
        hitSlop={theme.space[3]}
        onPress={() => {
          router.navigate({
            params: {
              name: removePrefix(comment.user.name),
            },
            pathname: '/users/[name]',
          })
        }}
      >
        <Text
          color={comment.op ? 'accent' : 'gray'}
          highContrast={!comment.op}
          lines={1}
          size="1"
          weight="medium"
        >
          {comment.user.name}
        </Text>

        {!collapsed ? (
          <FlairCard flair={comment.flair} show={['emoji']} />
        ) : null}
      </Pressable>

      <Text highContrast={false} size="1">
        {withoutAgo(
          f.relativeTime(comment.createdAt, {
            style: 'narrow',
          }),
        )}
      </Text>

      <View align="center" direction="row" gap="1">
        <FooterButton
          color={comment.liked ? theme.colors.orange.a9 : theme.colors.gray.a12}
          compact
          fill={comment.liked === true}
          icon="ArrowUp"
          onPress={() => {
            vote({
              commentId: comment.id,
              direction: comment.liked ? 0 : 1,
              postId: comment.postId,
            })
          }}
          weight="bold"
        />

        <Text size="1" tabular>
          {f.number(comment.votes, {
            notation: 'compact',
          })}
        </Text>

        <FooterButton
          color={
            comment.liked === false
              ? theme.colors.violet.a9
              : theme.colors.gray.a12
          }
          compact
          fill={comment.liked === false}
          icon="ArrowDown"
          onPress={() => {
            vote({
              commentId: comment.id,
              direction: comment.liked === false ? 0 : -1,
              postId: comment.postId,
            })
          }}
          weight="bold"
        />
      </View>

      <FooterButton
        color={theme.colors.gray.a12}
        compact
        icon="Share"
        onPress={() => {
          const url = new URL(comment.permalink, 'https://reddit.com')

          void Share.share({
            url: url.toString(),
          })
        }}
        weight="bold"
      />
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  sticky: {
    marginRight: -theme.space[1],
  },
}))
