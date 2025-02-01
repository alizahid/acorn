import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useFormatter } from 'use-intl'

import { useCommentVote } from '~/hooks/mutations/comments/vote'
import { removePrefix } from '~/lib/reddit'
import { type CommentReply } from '~/types/comment'

import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { TimeAgo } from '../common/time'
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
          color={theme.colors.red.accent}
          name="PushPin"
          size={theme.typography[1].lineHeight}
          style={styles.sticky}
          weight="fill"
        />
      ) : null}

      <Pressable
        align="center"
        direction="row"
        gap="2"
        hitSlop={theme.space[3]}
        onPress={() => {
          router.navigate({
            params: {
              name: removePrefix(comment.user.name),
            },
            pathname: '/users/[name]',
          })
        }}
        self="start"
      >
        {comment.user.image ? (
          <Image source={comment.user.image} style={styles.image} />
        ) : null}

        <Text
          color={comment.op ? 'accent' : 'gray'}
          highContrast={!comment.op}
          lines={1}
          size="1"
          weight="medium"
        >
          {comment.user.name}
        </Text>

        {!collapsed ? <FlairCard flair={comment.flair} /> : null}
      </Pressable>

      <Text highContrast={false} size="1">
        <TimeAgo>{comment.createdAt}</TimeAgo>
      </Text>

      <View align="center" direction="row" gap="1">
        <FooterButton
          color={
            comment.liked ? theme.colors.orange.accent : theme.colors.gray.text
          }
          compact
          icon="ArrowFatUp"
          onPress={() => {
            vote({
              commentId: comment.id,
              direction: comment.liked ? 0 : 1,
              postId: comment.post.id,
            })
          }}
          weight={comment.liked === true ? 'fill' : 'bold'}
        />

        <Text size="1" tabular>
          {f.number(comment.votes, {
            notation: 'compact',
          })}
        </Text>

        <FooterButton
          color={
            comment.liked === false
              ? theme.colors.violet.accent
              : theme.colors.gray.text
          }
          compact
          icon="ArrowFatDown"
          onPress={() => {
            vote({
              commentId: comment.id,
              direction: comment.liked === false ? 0 : -1,
              postId: comment.post.id,
            })
          }}
          weight={comment.liked === false ? 'fill' : 'bold'}
        />
      </View>
    </View>
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
  sticky: {
    marginRight: -theme.space[1],
  },
}))
