import { useRouter } from 'expo-router'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useFormatter } from 'use-intl'

import { withoutAgo } from '~/lib/intl'
import { removePrefix } from '~/lib/reddit'
import { type CommentReply } from '~/types/comment'

import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { View } from '../common/view'
import { FlairCard } from '../posts/flair'
import { FooterButton } from '../posts/footer/button'
import { CommentMenu } from './menu'

type Props = {
  collapsed?: boolean
  comment: CommentReply
}

export function CommentMeta({ collapsed, comment }: Props) {
  const router = useRouter()

  const f = useFormatter()

  const { styles, theme } = useStyles(stylesheet)

  return (
    <View
      align="center"
      direction="row"
      gap="3"
      p="3"
      pointerEvents="box-none"
      style={styles.main}
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

      <View align="center" direction="row" gap="1" pointerEvents="none">
        <Icon
          color={
            comment.liked
              ? theme.colors.orange.a9
              : comment.liked === false
                ? theme.colors.violet.a9
                : theme.colors.gray.a11
          }
          name={comment.liked === false ? 'ArrowFatDown' : 'ArrowFatUp'}
          size={theme.space[4]}
          weight={comment.liked !== null ? 'fill' : 'regular'}
        />

        <Text size="1" tabular>
          {f.number(comment.votes, {
            notation: 'compact',
          })}
        </Text>
      </View>

      <CommentMenu comment={comment}>
        <FooterButton
          color={theme.colors.gray.a11}
          compact
          icon="DotsThree"
          weight="bold"
        />
      </CommentMenu>
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: {
    backgroundColor: theme.colors.gray.a2,
  },
  sticky: {
    marginRight: -theme.space[1],
  },
}))
