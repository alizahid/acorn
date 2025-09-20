import { Link, useRouter } from 'expo-router'
import { Share } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { useHide } from '~/hooks/moderation/hide'
import { useCommentSave } from '~/hooks/mutations/comments/save'
import { useCommentVote } from '~/hooks/mutations/comments/vote'
import { getDepthColor } from '~/lib/colors'
import { cardMaxWidth, iPad } from '~/lib/common'
import { useGestures } from '~/stores/gestures'
import { usePreferences } from '~/stores/preferences'
import { oledTheme } from '~/styles/oled'
import { type Undefined } from '~/types'
import { type CommentReply } from '~/types/comment'

import { Gestures } from '../common/gestures'
import { Html } from '../common/html'
import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { View } from '../common/view'
import { FlairCard, type FlairType } from '../posts/flair'
import { CommentMenu } from './menu'
import { CommentMeta } from './meta'

type Props = {
  collapsed?: boolean
  comment: CommentReply
  disabled?: boolean
  dull?: boolean
  onPress: () => void
}

export function CommentCard({
  collapsed,
  comment,
  disabled,
  dull,
  onPress,
}: Props) {
  const router = useRouter()

  const a11y = useTranslations('a11y')

  const { colorfulComments, fontSizeComment, themeOled, userOnTop } =
    usePreferences()
  const {
    commentLeft,
    commentLeftLong,
    commentLeftShort,
    commentRight,
    commentRightLong,
    commentRightShort,
  } = useGestures()

  styles.useVariants({
    colorful: colorfulComments,
    dull,
    iPad,
    oled: themeOled,
  })

  const { vote } = useCommentVote()
  const { save } = useCommentSave()
  const { hide } = useHide()

  const flair = comment.flair.reduce<Undefined<FlairType>>((type, item) => {
    if (!type) {
      return item.type
    }

    if (type === item.type) {
      return type
    }

    return 'both'
  }, undefined)

  return (
    <Gestures
      data={comment}
      left={{
        enabled: commentLeft,
        long: commentLeftLong,
        short: commentLeftShort,
      }}
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
          router.push({
            params: {
              commentId: comment.id,
              id: comment.post.id,
              user: comment.user.name,
            },
            pathname: '/posts/[id]/reply',
          })
        }

        if (action === 'share') {
          const url = new URL(comment.permalink, 'https://www.reddit.com')

          Share.share({
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
      right={{
        enabled: commentRight,
        long: commentRightLong,
        short: commentRightShort,
      }}
      style={styles.container(comment.depth)}
    >
      <CommentMenu comment={comment}>
        <Pressable
          disabled={disabled}
          label={a11y(
            dull
              ? 'viewComment'
              : collapsed
                ? 'expandComment'
                : 'collapseComment',
          )}
          onPress={onPress}
          style={styles.main(comment.depth, dull)}
        >
          {userOnTop ? (
            <CommentMeta
              collapsed={collapsed}
              comment={comment}
              flair={flair}
              top
            />
          ) : null}

          {collapsed ? null : (
            <View p="3">
              <Html
                depth={comment.depth}
                meta={comment.media.meta}
                size={fontSizeComment}
                type="comment"
              >
                {comment.body}
              </Html>
            </View>
          )}

          {comment.post.title ? (
            <Link
              accessibilityHint={a11y('viewPost')}
              accessibilityLabel={comment.post.title}
              href={{
                params: {
                  id: comment.post.id,
                },
                pathname: '/posts/[id]',
              }}
              style={styles.post}
            >
              <Icon
                name="paperclip"
                uniProps={(theme) => ({
                  tintColor: theme.colors.gray.accent,
                })}
              />

              <View flex={1} gap="1">
                <Text size="1" weight="medium">
                  {comment.post.title}
                </Text>

                <Text highContrast={false} size="1">
                  r/{comment.community.name}
                </Text>
              </View>
            </Link>
          ) : null}

          {userOnTop ? null : (
            <CommentMeta
              collapsed={collapsed}
              comment={comment}
              flair={flair}
            />
          )}

          {!collapsed && (flair === 'both' || flair === 'text') ? (
            <FlairCard
              flair={comment.flair}
              style={styles.flair}
              type={flair}
            />
          ) : null}

          {comment.saved ? (
            <View pointerEvents="none" style={styles.saved} />
          ) : null}
        </Pressable>
      </CommentMenu>
    </Gestures>
  )
}

const styles = StyleSheet.create((theme, runtime) => ({
  body: {
    margin: theme.space[3],
  },
  container: (depth: number) => {
    const marginLeft = theme.space[2] * depth

    return {
      marginLeft,
      variants: {
        iPad: {
          true: {
            alignSelf: 'center',
            borderCurve: 'continuous',
            borderRadius: theme.radius[3],
            maxWidth: cardMaxWidth - marginLeft,
          },
        },
      },
      width: runtime.screen.width - marginLeft,
    }
  },
  flair: {
    marginBottom: theme.space[3],
    marginHorizontal: theme.space[3],
  },
  main: (depth: number, dull?: boolean) => {
    const color = dull ? 'gray' : getDepthColor(depth)
    const marginLeft = theme.space[2] * depth

    return {
      alignSelf: 'center',
      backgroundColor: theme.colors.gray.bgAlt,
      borderLeftColor: depth > 0 ? theme.colors[color].border : undefined,
      borderLeftWidth: depth > 0 ? theme.space[1] : undefined,
      compoundVariants: [
        {
          colorful: true,
          oled: true,
          styles: {
            backgroundColor: theme.colors[color].bg,
          },
        },
        {
          dull: true,
          oled: true,
          styles: {
            backgroundColor: oledTheme[theme.variant].bg,
          },
        },
      ],
      overflow: 'hidden',
      variants: {
        colorful: {
          true: {
            backgroundColor: theme.colors[color].bgAlt,
          },
        },
        dull: {
          true: {
            backgroundColor: theme.colors.gray.ui,
          },
        },
        iPad: {
          true: {
            borderCurve: 'continuous',
            borderRadius: theme.radius[3],
            maxWidth: cardMaxWidth - marginLeft,
          },
        },
        oled: {
          true: {
            backgroundColor: oledTheme[theme.variant].bg,
          },
        },
      },
      width: '100%',
    }
  },
  post: {
    alignItems: 'center',
    backgroundColor: theme.colors.gray.uiAlpha,
    borderCurve: 'continuous',
    borderRadius: theme.radius[4],
    flexDirection: 'row',
    gap: theme.space[2],
    marginBottom: theme.space[3],
    marginHorizontal: theme.space[3],
    padding: theme.space[2],
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
