import { type StyleProp, View, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useFormatter } from 'use-intl'

import { type ColorId, getColorForId } from '~/lib/colors'
import { withoutAgo } from '~/lib/intl'
import { type CommentReply } from '~/types/comment'

import { Markdown } from '../common/markdown'
import { Text } from '../common/text'
import { CommentSaveCard } from './save'
import { CommentVoteCard } from './vote'

type Props = {
  collapsed?: boolean
  comment: CommentReply
  style?: StyleProp<ViewStyle>
}

export function CommentCard({ collapsed, comment, style }: Props) {
  const f = useFormatter()

  const { styles, theme } = useStyles(stylesheet)

  const color = getColorForId(comment.parentId ?? comment.postId)

  return (
    <View
      style={[
        styles.main(color, comment.depth),
        collapsed && styles.collapsed,
        style,
      ]}
    >
      {!collapsed ? (
        <View style={styles.body}>
          <Markdown
            margin={
              theme.space[3] * (comment.depth + 2) + (comment.depth > 0 ? 2 : 0)
            }
            meta={comment.media.meta}
            size="2"
          >
            {comment.body}
          </Markdown>
        </View>
      ) : null}

      <View style={styles.footer}>
        <Text
          color={comment.op ? 'accent' : 'gray'}
          highContrast={false}
          size="1"
          weight="medium"
        >
          {comment.user.name}
        </Text>

        <Text highContrast={false} size="1">
          {withoutAgo(
            f.relativeTime(comment.createdAt, {
              style: 'narrow',
            }),
          )}
        </Text>

        {!collapsed ? (
          <>
            <CommentVoteCard comment={comment} />

            <CommentSaveCard comment={comment} />
          </>
        ) : null}
      </View>
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  body: {
    paddingRight: theme.space[3],
    paddingVertical: theme.space[3] / 2,
  },
  collapsed: {
    paddingTop: theme.space[3],
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.space[4],
    marginBottom: theme.space[3],
  },
  main: (color: ColorId, depth: number) => ({
    backgroundColor: theme.colors[color].a2,
    borderLeftColor: depth > 0 ? theme.colors[color].a6 : undefined,
    borderLeftWidth: depth > 0 ? 2 : undefined,
    marginLeft: theme.space[3] * depth,
    paddingLeft: theme.space[3],
  }),
}))
