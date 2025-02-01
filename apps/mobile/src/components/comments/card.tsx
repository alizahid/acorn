import { useRouter } from 'expo-router'
import { Share, type StyleProp, type ViewStyle } from 'react-native'
import {
  createStyleSheet,
  type UnistylesValues,
  useStyles,
} from 'react-native-unistyles'

import { useHide } from '~/hooks/moderation/hide'
import { useCommentSave } from '~/hooks/mutations/comments/save'
import { useCommentVote } from '~/hooks/mutations/comments/vote'
import { getDepthColor } from '~/lib/colors'
import { cardMaxWidth, iPad } from '~/lib/common'
import { CommentMenu } from '~/sheets/comment-menu'
import { usePreferences } from '~/stores/preferences'
import { oledTheme } from '~/styles/oled'
import { type CommentReply } from '~/types/comment'

import { PostGestures } from '../common/gestures'
import { Icon } from '../common/icon'
import { Markdown } from '../common/markdown'
import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { View } from '../common/view'
import { CommentMeta } from './meta'

type Props = {
  collapsed?: boolean
  comment: CommentReply
  disabled?: boolean
  dull?: boolean
  onPress: () => void
  style?: StyleProp<ViewStyle>
}

export function CommentCard({
  collapsed,
  comment,
  disabled,
  dull,
  onPress,
  style,
}: Props) {
  const router = useRouter()

  const { coloredComments, commentGestures, swipeGestures, themeOled } =
    usePreferences()

  const { styles, theme } = useStyles(stylesheet)

  const { vote } = useCommentVote()
  const { save } = useCommentSave()
  const { hide } = useHide()

  return (
    <PostGestures
      containerStyle={styles.container(comment.depth) as ViewStyle}
      data={comment}
      disabled={!swipeGestures || collapsed}
      gestures={commentGestures}
      onAction={(action) => {
        if (action === 'upvote') {
          vote({
            commentId: comment.id,
            direction: comment.liked ? 0 : 1,
            postId: comment.post.id,
          })
        }

        if (action === 'downvote') {
          vote({
            commentId: comment.id,
            direction: comment.liked === false ? 0 : -1,
            postId: comment.post.id,
          })
        }

        if (action === 'save') {
          save({
            action: comment.saved ? 'unsave' : 'save',
            commentId: comment.id,
            postId: comment.post.id,
          })
        }

        if (action === 'reply') {
          router.navigate({
            params: {
              commentId: comment.id,
              id: comment.post.id,
              user: comment.user.name,
            },
            pathname: '/posts/[id]/reply',
          })
        }

        if (action === 'share') {
          const url = new URL(comment.permalink, 'https://reddit.com')

          void Share.share({
            url: url.toString(),
          })
        }

        if (action === 'hide') {
          hide({
            action: 'hide',
            id: comment.id,
            postId: comment.post.id,
            type: 'comment',
          })
        }
      }}
      style={[
        styles.main(
          comment.depth,
          coloredComments,
          themeOled,
          dull,
        ) as ViewStyle,
        style,
      ]}
    >
      <Pressable
        disabled={disabled}
        onLongPress={() => {
          void CommentMenu.call({
            comment,
          })
        }}
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

        {comment.post.title ? (
          <Pressable
            align="center"
            direction="row"
            gap="2"
            mb="3"
            mx="3"
            onPress={() => {
              router.navigate({
                params: {
                  id: comment.post.id,
                },
                pathname: '/posts/[id]',
              })
            }}
            p="2"
            style={styles.post}
          >
            <Icon
              color={theme.colors.gray.accent}
              name="NoteBlank"
              weight="duotone"
            />

            <View flex={1} gap="1">
              <Text size="1" weight="medium">
                {comment.post.title}
              </Text>

              <Text highContrast={false} size="1">
                r/{comment.community.name}
              </Text>
            </View>
          </Pressable>
        ) : null}

        <CommentMeta collapsed={collapsed} comment={comment} />
      </Pressable>

      {comment.saved ? (
        <View pointerEvents="none" style={styles.saved} />
      ) : null}
    </PostGestures>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  body: {
    margin: theme.space[3],
  },
  container: (depth: number) => {
    const marginLeft = theme.space[2] * depth

    const base: UnistylesValues = {
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
  main: (depth: number, colored: boolean, oled: boolean, dull?: boolean) => {
    const color = dull ? 'gray' : getDepthColor(depth)

    const base: UnistylesValues = {
      backgroundColor: dull
        ? oled
          ? oledTheme[theme.name].bg
          : theme.colors.gray.ui
        : colored
          ? theme.colors[color][oled ? 'bg' : 'bgAlt']
          : oled
            ? oledTheme[theme.name].bg
            : theme.colors.gray.bgAlt,
      borderLeftColor: depth > 0 ? theme.colors[color].border : undefined,
      borderLeftWidth: depth > 0 ? theme.space[1] : undefined,
      overflow: 'hidden',
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
  post: {
    backgroundColor: theme.colors.gray.uiAlpha,
    borderCurve: 'continuous',
    borderRadius: theme.radius[4],
  },
  saved: {
    backgroundColor: theme.colors.green.accent,
    height: theme.space[8],
    position: 'absolute',
    right: -theme.space[6],
    top: -theme.space[6],
    transform: [
      {
        rotate: '45deg',
      },
    ],
    width: theme.space[8],
  },
}))
