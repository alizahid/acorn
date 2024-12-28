import { useRouter } from 'expo-router'
import { type StyleProp, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { useCommentSave } from '~/hooks/mutations/comments/save'
import { useCommentVote } from '~/hooks/mutations/comments/vote'
import { getDepthColor } from '~/lib/colors'
import { cardMaxWidth, iPad } from '~/lib/common'
import { usePreferences } from '~/stores/preferences'
import { type CommentReply } from '~/types/comment'

import { PostGestures } from '../common/gestures'
import { Markdown } from '../common/markdown'
import { Pressable } from '../common/pressable'
import { View } from '../common/view'
import { CommentMenu } from './menu'
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

  const { coloredComments, commentGestures, swipeGestures } = usePreferences()

  const { styles } = useStyles(stylesheet)

  const { vote } = useCommentVote()
  const { save } = useCommentSave()

  return (
    <CommentMenu
      comment={comment}
      onPress={onPress}
      style={styles.container(comment.depth)}
    >
      <PostGestures
        containerStyle={styles.gestures()}
        data={comment}
        disabled={!swipeGestures || collapsed}
        gestures={commentGestures}
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
        style={[styles.main(comment.depth, coloredComments), style]}
      >
        <Pressable
          disabled={disabled}
          onPress={() => {
            onPress()
          }}
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

          {comment.liked !== null ? (
            <View
              pointerEvents="none"
              style={[styles.saved, styles.liked(comment.liked)]}
            />
          ) : null}

          {comment.saved ? (
            <View pointerEvents="none" style={styles.saved} />
          ) : null}
        </Pressable>
      </PostGestures>
    </CommentMenu>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  body: {
    margin: theme.space[3],
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
  gestures: () => {
    if (iPad) {
      return {
        borderCurve: 'continuous',
        borderRadius: theme.radius[3],
      }
    }

    return {}
  },
  liked: (liked: boolean) => ({
    backgroundColor: liked ? theme.colors.orange[9] : theme.colors.violet[9],
    top: -theme.space[iPad ? 6 : 4],
  }),
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
    bottom: -theme.space[iPad ? 6 : 4],
    height: theme.space[iPad ? 8 : 6],
    position: 'absolute',
    right: -theme.space[iPad ? 6 : 4],
    transform: [
      {
        rotate: '45deg',
      },
    ],
    width: theme.space[iPad ? 8 : 6],
  },
}))
