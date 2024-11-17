import { useRouter } from 'expo-router'
import { type StyleProp, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { useCommentSave } from '~/hooks/mutations/comments/save'
import { useCommentVote } from '~/hooks/mutations/comments/vote'
import { getDepthColor } from '~/lib/colors'
import { cardMaxWidth, iPad } from '~/lib/common'
import { usePreferences } from '~/stores/preferences'
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
  style?: StyleProp<ViewStyle>
}

export function CommentCard({
  collapsed,
  comment,
  disabled,
  onPress,
  style,
}: Props) {
  const router = useRouter()

  const { coloredComments, gestures } = usePreferences()

  const { styles } = useStyles(stylesheet)

  const { vote } = useCommentVote()
  const { save } = useCommentSave()

  return (
    <PostGestures
      containerStyle={styles.container(comment.depth)}
      disabled={!gestures || collapsed}
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
          router.navigate({
            params: {
              commentId: comment.id,
              id: comment.postId,
              user: comment.user.name,
            },
            pathname: '/posts/[id]/reply',
          })
        }
      }}
      saved={comment.saved}
      style={[styles.main(comment.depth, coloredComments), style]}
    >
      <Pressable
        disabled={disabled}
        onPress={(event) => {
          if (event.target !== event.currentTarget) {
            event.preventDefault()

            return
          }

          onPress()
        }}
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

        {comment.saved ? (
          <View pointerEvents="none" style={styles.saved} />
        ) : null}
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
    const marginLeft = theme.space[2] * depth

    const base = {
      marginLeft,
    }

    if (iPad) {
      return {
        ...base,
        alignSelf: 'center',
        borderCurve: 'continuous',
        borderRadius: theme.radius[3],
        maxWidth: cardMaxWidth - marginLeft,
        width: '100%',
      }
    }

    return base
  },
  main: (depth: number, colored: boolean) => {
    const color = getDepthColor(depth)

    const base = {
      backgroundColor: colored ? theme.colors[color][2] : theme.colors.gray[2],
      borderLeftColor: depth > 0 ? theme.colors[color][6] : undefined,
      borderLeftWidth: depth > 0 ? theme.space[1] : undefined,
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
