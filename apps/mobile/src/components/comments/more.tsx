import * as Linking from 'expo-linking'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { useLoadMoreComments } from '~/hooks/mutations/comments/more'
import { type ColorId, getColorForId } from '~/lib/colors'
import { removePrefix } from '~/lib/reddit'
import { type CommentMore } from '~/types/comment'
import { type Post } from '~/types/post'

import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'
import { Spinner } from '../common/spinner'
import { Text } from '../common/text'

type Props = {
  comment: CommentMore
  post?: Post
}

export function CommentMoreCard({ comment, post }: Props) {
  const t = useTranslations('component.comments.more')

  const { styles, theme } = useStyles(stylesheet)

  const { isPending, loadMore } = useLoadMoreComments()

  const color = getColorForId(comment.parentId)

  return (
    <Pressable
      disabled={isPending}
      onPress={() => {
        if (!post) {
          return
        }

        if (comment.id === '_') {
          const url = `https://www.reddit.com/r/${post.subreddit}/comments/${removePrefix(post.id)}/comment/${removePrefix(comment.parentId)}/`

          void Linking.openURL(url)
        } else {
          loadMore({
            children: comment.children,
            id: comment.id,
            postId: post.id,
          })
        }
      }}
      style={styles.main(color, comment.depth)}
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
  main: (color: ColorId, depth: number) => ({
    alignItems: 'center',
    backgroundColor: theme.colors[color].a2,
    borderLeftColor: depth > 0 ? theme.colors[color].a6 : undefined,
    borderLeftWidth: depth > 0 ? 2 : undefined,
    flexDirection: 'row',
    gap: theme.space[4],
    justifyContent: 'center',
    marginLeft: theme.space[3] * depth,
    paddingVertical: theme.space[2],
  }),
}))
