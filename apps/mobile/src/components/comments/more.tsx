import * as Linking from 'expo-linking'
import { type StyleProp, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { useLoadMoreComments } from '~/hooks/mutations/comments/more'
import { getDepthColor } from '~/lib/colors'
import { type CommentMore } from '~/types/comment'
import { type Post } from '~/types/post'

import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'
import { Spinner } from '../common/spinner'
import { Text } from '../common/text'

type Props = {
  comment: CommentMore
  post?: Post
  style?: StyleProp<ViewStyle>
}

export function CommentMoreCard({ comment, post, style }: Props) {
  const t = useTranslations('component.comments.more')

  const { styles, theme } = useStyles(stylesheet)

  const { isPending, loadMore } = useLoadMoreComments()

  return (
    <Pressable
      disabled={isPending}
      onPress={() => {
        if (!post) {
          return
        }

        if (comment.id === '_') {
          const url = `https://www.reddit.com/r/${post.subreddit}/comments/${post.id}/comment/${comment.parentId}/`

          void Linking.openURL(url)
        } else {
          loadMore({
            children: comment.children,
            id: comment.id,
            postId: post.id,
          })
        }
      }}
      style={[styles.main(comment.depth), style]}
    >
      {isPending ? (
        <Spinner />
      ) : (
        <>
          <Text color="accent" size="2" weight="medium">
            {t('label', {
              count: comment.count,
            })}
          </Text>

          {comment.id === '_' ? (
            <Icon
              color={theme.colors.accent.a11}
              name="ArrowSquareOut"
              size={theme.typography[2].lineHeight}
            />
          ) : null}
        </>
      )}
    </Pressable>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: (depth: number) => {
    const color = getDepthColor(depth)

    return {
      alignItems: 'center',
      backgroundColor: theme.colors[color].a2,
      borderLeftColor: depth > 0 ? theme.colors[color].a6 : undefined,
      borderLeftWidth: depth > 0 ? theme.space[1] : undefined,
      flexDirection: 'row',
      gap: theme.space[4],
      justifyContent: 'center',
      marginLeft: theme.space[3] * depth,
      paddingVertical: theme.space[2],
    }
  },
}))
