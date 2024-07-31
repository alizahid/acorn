import { View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useFormatter } from 'use-intl'

import { useCommentVote } from '~/hooks/mutations/comments/vote'
import { type CommentReply } from '~/types/comment'

import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'
import { Text } from '../common/text'

type Props = {
  comment: CommentReply
  postId?: string
}

export function CommentVoteCard({ comment, postId }: Props) {
  const f = useFormatter()

  const { styles, theme } = useStyles(stylesheet)

  const { vote } = useCommentVote()

  const color = theme.colors.gray.a11

  return (
    <View style={styles.main}>
      <Pressable
        hitSlop={theme.space[4]}
        onPress={() => {
          vote({
            commentId: comment.id,
            direction: comment.liked ? 0 : 1,
            postId,
          })
        }}
      >
        <Icon
          color={comment.liked ? theme.colors.green.a9 : color}
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
            postId,
          })
        }}
      >
        <Icon
          color={comment.liked === false ? theme.colors.red.a9 : color}
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
    alignItems: 'center',
    borderRadius: theme.radius[3],
    flexDirection: 'row',
    gap: theme.space[2],
  },
}))
