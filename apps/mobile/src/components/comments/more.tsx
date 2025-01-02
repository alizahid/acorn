import { type StyleProp, type ViewStyle } from 'react-native'
import {
  createStyleSheet,
  type UnistylesValues,
  useStyles,
} from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { useLoadMoreComments } from '~/hooks/mutations/comments/more'
import { getDepthColor } from '~/lib/colors'
import { cardMaxWidth, iPad } from '~/lib/common'
import { usePreferences } from '~/stores/preferences'
import { type CommentMore } from '~/types/comment'
import { type Post } from '~/types/post'

import { Pressable } from '../common/pressable'
import { Spinner } from '../common/spinner'
import { Text } from '../common/text'

type Props = {
  comment: CommentMore
  onThread: (id: string) => void
  post?: Post
  style?: StyleProp<ViewStyle>
}

export function CommentMoreCard({ comment, onThread, post, style }: Props) {
  const t = useTranslations('component.comments.more')

  const { coloredComments } = usePreferences()

  const { styles } = useStyles(stylesheet)

  const { isPending, loadMore } = useLoadMoreComments()

  return (
    <Pressable
      align="center"
      direction="row"
      disabled={isPending}
      gap="4"
      justify="center"
      onPress={() => {
        if (!post) {
          return
        }

        if (comment.id === '_') {
          onThread(comment.parentId)
        } else {
          loadMore({
            children: comment.children,
            id: comment.id,
            postId: post.id,
          })
        }
      }}
      py="2"
      style={[styles.main(comment.depth, coloredComments) as ViewStyle, style]}
    >
      {isPending ? (
        <Spinner />
      ) : (
        <Text color="accent" size="2" weight="medium">
          {t('label', {
            count: comment.count,
          })}
        </Text>
      )}
    </Pressable>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: (depth: number, colored: boolean) => {
    const color = getDepthColor(depth)

    const marginLeft = theme.space[2] * depth

    const base: UnistylesValues = {
      backgroundColor: colored ? theme.colors[color][2] : theme.colors.gray[2],
      borderLeftColor: depth > 0 ? theme.colors[color][6] : undefined,
      borderLeftWidth: depth > 0 ? theme.space[1] : undefined,
      marginLeft,
    }

    if (iPad) {
      return {
        ...base,
        alignSelf: 'center',
        borderCurve: 'continuous',
        maxWidth: cardMaxWidth - marginLeft,
        width: '100%',
      }
    }

    return base
  },
}))
