import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useFormatter } from 'use-intl'

import { type CommentReply } from '~/types/comment'

import { Icon } from '../common/icon'
import { Text } from '../common/text'
import { TimeAgo } from '../common/time'
import { Markdown } from '../markdown'

type Props = {
  comment: CommentReply
}

export function CommentChip({ comment }: Props) {
  const f = useFormatter()

  return (
    <View style={styles.main}>
      <View style={styles.header}>
        <Text
          color={comment.op ? 'accent' : 'gray'}
          highContrast={!comment.op}
          numberOfLines={1}
          size="1"
          weight="medium"
        >
          {comment.user.name}
        </Text>

        <Text highContrast={false} size="1">
          <TimeAgo date={comment.createdAt} />
        </Text>

        <View style={styles.upvotes}>
          <Icon
            name="arrow-fat-up"
            uniProps={(theme) => ({
              color: theme.colors.gray.text,
              size: theme.typography[1].fontSize,
            })}
          />

          <Text size="1" tabular>
            {f.number(comment.votes, {
              notation: 'compact',
            })}
          </Text>
        </View>
      </View>

      <Markdown meta={comment.media.meta} type="comment">
        {comment.body}
      </Markdown>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  header: {
    flexDirection: 'row',
    gap: theme.space[3],
  },
  main: {
    backgroundColor: theme.colors.accent.ui,
    gap: theme.space[3],
    padding: theme.space[3],
  },
  upvotes: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.space[1],
  },
}))
