import { type StyleProp, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { useCommentSave } from '~/hooks/mutations/comments/save'
import { useCommentVote } from '~/hooks/mutations/comments/vote'
import { getDepthColor } from '~/lib/colors'
import { cardMaxWidth, iPad } from '~/lib/common'
import { type CommentReply } from '~/types/comment'

import { Markdown } from '../common/markdown'
import { Pressable } from '../common/pressable'
import { View } from '../common/view'
import { PostGestures } from '../posts/gestures'
import { CommentMeta } from './meta'

type Props = {
  collapsed?: boolean
  comment: CommentReply
  disabled?: boolean
  onPress: () => void
  onReply?: () => void
  style?: StyleProp<ViewStyle>
}

export function CommentCard({
  collapsed,
  comment,
  disabled,
  onPress,
  onReply,
  style,
}: Props) {
  const { styles } = useStyles(stylesheet)

  const { vote } = useCommentVote()
  const { save } = useCommentSave()

  return (
    <PostGestures
      containerStyle={styles.container(comment.depth)}
      disabled={collapsed}
      liked={comment.liked}
      onAction={(action) => {
        if (action === 'upvote') {
          vote({
            commentId: comment.id,
            direction: comment.liked ? 0 : 1,
            postId: comment.postId,
          })
        }

        if (action === 'downvote') {
          vote({
            commentId: comment.id,
            direction: comment.liked === false ? 0 : -1,
            postId: comment.postId,
          })
        }

        if (action === 'save') {
          save({
            action: comment.saved ? 'unsave' : 'save',
            commentId: comment.id,
            postId: comment.postId,
          })
        }

        if (action === 'reply') {
          onReply?.()
        }
      }}
      saved={comment.saved}
      style={[styles.main(comment.depth), style]}
    >
      <Pressable
        disabled={disabled}
        onPress={onPress}
        pl="3"
        pt={collapsed ? '3' : undefined}
      >
        {!collapsed ? (
          <Markdown
            meta={comment.media.meta}
            recyclingKey={comment.id}
            size="2"
            style={styles.body}
            variant="comment"
          >
            {comment.body}
          </Markdown>
        ) : null}

        <CommentMeta collapsed={collapsed} comment={comment} />

        {comment.saved ? <View style={styles.saved} /> : null}
      </Pressable>
    </PostGestures>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  body: {
    marginRight: theme.space[3],
    marginVertical: theme.space[3],
  },
  container: (depth: number) => {
    const margin = theme.space[3] * depth

    const base = {
      marginLeft: margin + (depth > 0 ? theme.space[1] : 0),
    }

    if (iPad) {
      return {
        ...base,
        alignSelf: 'center',
        borderCurve: 'continuous',
        borderRadius: theme.radius[3],
        maxWidth: cardMaxWidth - margin,
        width: '100%',
      }
    }

    return base
  },
  main: (depth: number) => {
    const color = getDepthColor(depth)

    const base = {
      backgroundColor: theme.colors[color][3],
      borderLeftColor: depth > 0 ? theme.colors[color].a6 : undefined,
      borderLeftWidth: depth > 0 ? theme.space[1] : 0,
      overflow: 'hidden' as const,
    }

    if (iPad) {
      return {
        ...base,
        borderCurve: 'continuous',
        borderRadius: theme.radius[2],
      }
    }

    return base
  },
  saved: {
    backgroundColor: theme.colors.green[9],
    bottom: -theme.space[iPad ? 5 : 4],
    height: theme.space[iPad ? 8 : 6],
    position: 'absolute',
    right: -theme.space[iPad ? 5 : 4],
    transform: [
      {
        rotate: '45deg',
      },
    ],
    width: theme.space[iPad ? 8 : 6],
  },
}))
