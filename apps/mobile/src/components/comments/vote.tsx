import { View } from 'react-native'
import ArrowFatDownFillIcon from 'react-native-phosphor/src/fill/ArrowFatDown'
import ArrowFatUpFillIcon from 'react-native-phosphor/src/fill/ArrowFatUp'
import ArrowFatDownIcon from 'react-native-phosphor/src/regular/ArrowFatDown'
import ArrowFatUpIcon from 'react-native-phosphor/src/regular/ArrowFatUp'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useFormatter } from 'use-intl'

import { useCommentVote } from '~/hooks/mutations/comments/vote'
import { type Comment } from '~/types/comment'

import { Pressable } from '../common/pressable'
import { Text } from '../common/text'

type Props = {
  comment: Comment
  postId?: string
}

export function CommentVoteCard({ comment, postId }: Props) {
  const f = useFormatter()

  const { styles, theme } = useStyles(stylesheet)

  const { vote } = useCommentVote()

  const Up = comment.liked ? ArrowFatUpFillIcon : ArrowFatUpIcon
  const Down = comment.liked === false ? ArrowFatDownFillIcon : ArrowFatDownIcon

  const color = theme.colors.grayA[11]

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
        <Up
          color={comment.liked ? theme.colors.greenA[9] : color}
          size={theme.typography[1].lineHeight}
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
        <Down
          color={comment.liked === false ? theme.colors.redA[9] : color}
          size={theme.typography[1].lineHeight}
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
