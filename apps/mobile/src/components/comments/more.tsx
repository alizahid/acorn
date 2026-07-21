import { type StyleProp, type ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { useShallow } from 'zustand/react/shallow'

import { useLoadMoreComments } from '~/hooks/mutations/comments/more'
import { getDepthColor } from '~/lib/colors'
import { usePreferences } from '~/stores/preferences'
import { type CommentMore } from '~/types/comment'
import { type Post } from '~/types/post'
import { type CommentSort } from '~/types/sort'

import { Pressable } from '../common/pressable'
import { Spinner } from '../common/spinner'
import { Text } from '../common/text'

type Props = {
  comment: CommentMore
  onThread: (id: string) => void
  post?: Post
  sort: CommentSort
  style?: StyleProp<ViewStyle>
}

export function CommentMoreCard({
  comment,
  onThread,
  post,
  sort,
  style,
}: Props) {
  const t = useTranslations('component.comments.more')

  const { colorfulComments } = usePreferences(
    useShallow((state) => ({
      colorfulComments: state.colorfulComments,
    })),
  )

  styles.useVariants({
    colorful: colorfulComments,
  })

  const { isPending, loadMore } = useLoadMoreComments()

  const color = getDepthColor(comment.depth)

  const label = t('label', {
    count: comment.children.length,
  })

  return (
    <Pressable
      accessibilityLabel={label}
      disabled={isPending}
      onPress={() => {
        if (!post) {
          return
        }

        if (comment.id === '_') {
          onThread(comment.parentId)
        } else {
          loadMore({
            children: comment.children,
            depth: comment.depth,
            id: comment.id,
            postId: post.id,
            sort,
          })
        }
      }}
      style={[styles.main(comment.depth), style]}
    >
      {isPending ? (
        <Spinner color={color} />
      ) : (
        <Text color={color} size="2" weight="medium">
          {label}
        </Text>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create((theme) => ({
  main: (depth: number) => {
    const color = getDepthColor(depth)

    return {
      backgroundColor: theme.colors.ui.bg,
      borderBottomLeftRadius: depth > 0 ? theme.radius[3] : undefined,
      borderCurve: 'continuous',
      borderLeftColor: depth > 0 ? theme.colors[color].border : undefined,
      borderLeftWidth: depth > 0 ? theme.space[1] : undefined,
      borderTopLeftRadius: depth > 0 ? theme.radius[3] : undefined,
      flexDirection: 'row',
      gap: theme.space[4],
      justifyContent: 'center',
      marginLeft: theme.space[3] * depth,
      overflow: 'hidden',
      paddingVertical: theme.space[2],
      variants: {
        colorful: {
          true: {
            backgroundColor: theme.colors[color].bgAlt,
          },
        },
      },
    }
  },
}))
