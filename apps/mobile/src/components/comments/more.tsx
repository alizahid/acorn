import { type StyleProp, type ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { useLoadMoreComments } from '~/hooks/mutations/comments/more'
import { getDepthColor } from '~/lib/colors'
import { cardMaxWidth, iPad } from '~/lib/common'
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

  const { colorfulComments } = usePreferences(['colorfulComments'])

  styles.useVariants({
    colorful: colorfulComments,
    iPad,
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

const styles = StyleSheet.create((theme, runtime) => ({
  main: (depth: number) => {
    const color = getDepthColor(depth)
    const marginLeft = theme.space[2] * depth

    return {
      alignItems: 'center',
      backgroundColor: theme.colors.ui.bg,
      borderLeftColor: depth > 0 ? theme.colors[color].border : undefined,
      borderLeftWidth: depth > 0 ? theme.space[1] : undefined,
      flexDirection: 'row',
      gap: theme.space[4],
      justifyContent: 'center',
      marginLeft,
      overflow: 'hidden',
      paddingVertical: theme.space[2],
      variants: {
        colorful: {
          true: {
            backgroundColor: theme.colors[color].bgAlt,
          },
        },
        iPad: {
          false: {
            borderBottomLeftRadius: depth > 0 ? theme.radius[3] : undefined,
            borderTopLeftRadius: depth > 0 ? theme.radius[3] : undefined,
            maxWidth: runtime.screen.width - marginLeft,
          },
          true: {
            alignSelf: 'center',
            borderCurve: 'continuous',
            borderRadius: theme.radius[3],
            maxWidth: cardMaxWidth - marginLeft,
          },
        },
      },
      width: '100%',
    }
  },
}))
