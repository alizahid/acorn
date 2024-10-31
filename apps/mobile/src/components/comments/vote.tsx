import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useFormatter } from 'use-intl'

import { useCommentVote } from '~/hooks/mutations/comments/vote'
import { type CommentReply } from '~/types/comment'

import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { View } from '../common/view'

type Props = {
  comment: CommentReply
}

export function CommentVoteCard({ comment }: Props) {
  const f = useFormatter()

  const { styles, theme } = useStyles(stylesheet)

  const { vote } = useCommentVote()

  const color = theme.colors.gray.a11

  return (
    <View align="center" direction="row" gap="2" style={styles.main}>
      <Pressable
        hitSlop={theme.space[4]}
        onPress={() => {
          vote({
            commentId: comment.id,
            direction: comment.liked ? 0 : 1,
            postId: comment.postId,
          })
        }}
      >
        <Icon
          color={comment.liked ? theme.colors.orange.a9 : color}
          name="ArrowFatUp"
          size={theme.space[4]}
          weight={comment.liked ? 'fill' : 'bold'}
        />
      </Pressable>

      <Text size="1" tabular>
        {f.number(comment.votes, {
          notation: 'compact',
        })}
      </Text>

      <Pressable
        hitSlop={theme.space[4]}
        onPress={() => {
          vote({
            commentId: comment.id,
            direction: comment.liked === false ? 0 : -1,
            postId: comment.postId,
          })
        }}
      >
        <Icon
          color={comment.liked === false ? theme.colors.violet.a9 : color}
          name="ArrowFatDown"
          size={theme.space[4]}
          weight={comment.liked === false ? 'fill' : 'bold'}
        />
      </Pressable>
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: {
    borderCurve: 'continuous',
    borderRadius: theme.radius[3],
  },
}))
