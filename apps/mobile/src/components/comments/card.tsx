import { Link, useRouter } from 'expo-router'
import { useRef, useState } from 'react'
import { Share, View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { useHide } from '~/hooks/moderation/hide'
import { useCommentSave } from '~/hooks/mutations/comments/save'
import { useCommentVote } from '~/hooks/mutations/comments/vote'
import { getDepthColor } from '~/lib/colors'
import { cardMaxWidth, iPad } from '~/lib/common'
import { REDDIT_URI } from '~/reddit/api'
import { useGestures } from '~/stores/gestures'
import { usePreferences } from '~/stores/preferences'
import { type Undefined } from '~/types'
import { type CommentReply } from '~/types/comment'

import { Banner } from '../common/banner'
import { Gestures } from '../common/gestures'
import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'
import { type Sheet } from '../common/sheet'
import { Text } from '../common/text'
import { Markdown } from '../markdown'
import { FlairCard, type FlairType } from '../posts/flair'
import { CommentMenu } from './menu'
import { CommentMeta } from './meta'

type Props = {
  collapsed?: boolean
  comment: CommentReply
  disabled?: boolean
  dull?: boolean
  onCollapse?: () => void
  onCollapseThread?: () => void
  onPress: () => void
}

export function CommentCard({
  collapsed,
  comment,
  disabled,
  dull,
  onCollapse,
  onCollapseThread,
  onPress,
}: Props) {
  const router = useRouter()

  const a11y = useTranslations('a11y')

  const { colorfulComments, privateScreenshots, userOnTop } = usePreferences(
    (state) => ({
      colorfulComments: state.colorfulComments,
      privateScreenshots: state.privateScreenshots,
      userOnTop: state.userOnTop,
    }),
  )

  const {
    commentLeft,
    commentLeftLong,
    commentLeftShort,
    commentRight,
    commentRightLong,
    commentRightShort,
  } = useGestures((state) => ({
    commentLeft: state.commentLeft,
    commentLeftLong: state.commentLeftLong,
    commentLeftShort: state.commentLeftShort,
    commentRight: state.commentRight,
    commentRightLong: state.commentRightLong,
    commentRightShort: state.commentRightShort,
  }))

  const card = useRef<View>(null)
  const menu = useRef<Sheet>(null)

  const [capturing, setCapturing] = useState(false)

  styles.useVariants({
    colorful: colorfulComments,
    dull,
    iPad,
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

  const privacy = privateScreenshots && capturing

  return (
    <Gestures
      data={{
        collapsed,
        liked: comment.liked,
        saved: comment.saved,
      }}
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
          const url = new URL(comment.permalink, REDDIT_URI)

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

        if (action === 'collapse') {
          onCollapse?.()
        }

        if (action === 'collapseThread') {
          onCollapseThread?.()
        }
      }}
      right={{
        enabled: commentRight,
        long: commentRightLong,
        short: commentRightShort,
      }}
      style={styles.container(comment.depth)}
    >
      <CommentMenu
        card={card}
        comment={comment}
        onCapturing={setCapturing}
        onCollapse={onCollapse}
        onCollapseThread={onCollapseThread}
        ref={menu}
      >
        <Pressable
          accessibilityLabel={a11y(
            dull
              ? 'viewComment'
              : collapsed
                ? 'expandComment'
                : 'collapseComment',
          )}
          disabled={disabled}
          onLongPress={() => {
            menu.current?.present()
          }}
          onPress={onPress}
        >
          <View
            collapsable={false}
            ref={card}
            style={styles.main(comment.depth, dull)}
          >
            {userOnTop ? (
              <CommentMeta
                collapsed={collapsed}
                comment={comment}
                flair={flair}
                privacy={privacy}
                top
              />
            ) : null}

            {collapsed ? null : (
              <View style={styles.body}>
                <Markdown meta={comment.media.meta} type="comment">
                  {comment.body}
                </Markdown>
              </View>
            )}

            {comment.post.title ? (
              <Link
                asChild
                href={{
                  params: {
                    id: comment.post.id,
                  },
                  pathname: '/posts/[id]',
                }}
              >
                <Pressable
                  accessibilityHint={a11y('viewPost')}
                  accessibilityLabel={comment.post.title}
                  style={styles.post}
                >
                  <Icon
                    name="paperclip"
                    uniProps={(theme) => ({
                      color: theme.colors.gray.accent,
                    })}
                  />

                  <View style={styles.title}>
                    <Text size="1" weight="medium">
                      {comment.post.title}
                    </Text>

                    <Text highContrast={false} size="1">
                      r/{comment.community.name}
                    </Text>
                  </View>
                </Pressable>
              </Link>
            ) : null}

            {userOnTop ? null : (
              <CommentMeta
                collapsed={collapsed}
                comment={comment}
                flair={flair}
                privacy={privacy}
              />
            )}

            {!collapsed && (flair === 'both' || flair === 'text') ? (
              <FlairCard
                flair={comment.flair}
                style={styles.flair}
                type={flair}
              />
            ) : null}

            {capturing ? <Banner /> : null}

            {!privacy && comment.saved ? (
              <View pointerEvents="none" style={styles.saved} />
            ) : null}
          </View>
        </Pressable>
      </CommentMenu>
    </Gestures>
  )
}

const styles = StyleSheet.create((theme, runtime) => ({
  body: {
    padding: theme.space[3],
  },
  container: (depth: number) => {
    const marginLeft = theme.space[2] * depth

    return {
      alignSelf: 'center',
      borderCurve: 'continuous',
      marginLeft,
      overflow: 'hidden',
      variants: {
        iPad: {
          false: {
            borderBottomLeftRadius: depth > 0 ? theme.radius[3] : undefined,
            borderTopLeftRadius: depth > 0 ? theme.radius[3] : undefined,
            maxWidth: runtime.screen.width - marginLeft,
          },
          true: {
            borderRadius: theme.radius[3],
            maxWidth: cardMaxWidth - marginLeft,
          },
        },
      },
      width: '100%',
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
      borderLeftColor: depth > 0 ? theme.colors[color].border : undefined,
      borderLeftWidth: depth > 0 ? theme.space[1] : undefined,
      overflow: 'hidden',
      variants: {
        colorful: {
          false: {
            backgroundColor: theme.colors.ui.bg,
          },
          true: {
            backgroundColor: theme.colors[color].bgAlt,
          },
        },
        dull: {
          true: {
            backgroundColor: theme.colors.ui.bg,
          },
        },
        iPad: {
          false: {
            maxWidth: runtime.screen.width - marginLeft,
          },
          true: {
            maxWidth: cardMaxWidth - marginLeft,
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
  title: {
    flex: 1,
    gap: theme.space[1],
  },
}))
