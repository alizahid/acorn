import { Share } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useFormatter } from 'use-intl'

import { useCommentVote } from '~/hooks/mutations/comments/vote'
import { withoutAgo } from '~/lib/intl'
import { type CommentReply } from '~/types/comment'

import { Icon } from '../common/icon'
import { Text } from '../common/text'
import { View } from '../common/view'
import { FooterButton } from '../posts/footer/button'

type Props = {
  collapsed?: boolean
  comment: CommentReply
}

export function CommentMeta({ collapsed, comment }: Props) {
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
          icon="ArrowFatUp"
          onPress={() => {
            vote({
              commentId: comment.id,
              direction: comment.liked ? 0 : 1,
              postId: comment.postId,
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
              ? theme.colors.violet.a9
              : theme.colors.gray.a12
          }
          compact
          icon="ArrowFatDown"
          onPress={() => {
            vote({
              commentId: comment.id,
              direction: comment.liked === false ? 0 : -1,
              postId: comment.postId,
            })
          }}
          weight={comment.liked === false ? 'fill' : 'bold'}
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
