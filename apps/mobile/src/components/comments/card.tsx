import { type StyleProp, View, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useFormatter } from 'use-intl'

import { type Comment } from '~/types/comment'

import { Markdown } from '../common/markdown'
import { Text } from '../common/text'
import { CommentVote } from './vote'

type Props = {
  comment: Comment
  postId?: string
  style?: StyleProp<ViewStyle>
}

export function CommentCard({ comment, postId, style }: Props) {
  const f = useFormatter()

  const { styles } = useStyles(stylesheet)

  return (
    <View style={[styles.main, style]}>
      <View style={styles.body}>
        <Markdown size="2">{comment.body}</Markdown>
      </View>

      <View style={styles.footer}>
        <Text highContrast={false} size="1" weight="medium">
          {comment.user.name}
        </Text>

        <Text highContrast={false} size="1">
          {f.relativeTime(comment.createdAt, {
            style: 'narrow',
          })}
        </Text>

        <CommentVote comment={comment} postId={postId} />
      </View>

      {comment.replies.length > 0
        ? comment.replies.map((item) => (
            <CommentCard
              comment={item}
              key={item.id}
              postId={postId}
              style={styles.reply}
            />
          ))
        : null}
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  body: {
    marginRight: theme.space[3],
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.space[4],
    marginBottom: theme.space[3],
  },
  main: {
    backgroundColor: theme.colors.grayA[2],
    paddingLeft: theme.space[3],
  },
  reply: {
    borderLeftColor: theme.colors.grayA[6],
    borderLeftWidth: 2,
    marginBottom: theme.space[3],
  },
}))
