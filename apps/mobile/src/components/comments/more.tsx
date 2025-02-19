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
import { oledTheme } from '~/styles/oled'
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

  const { coloredComments, themeOled } = usePreferences()

  const { styles } = useStyles(stylesheet)

  const { isPending, loadMore } = useLoadMoreComments()

  const color = getDepthColor(comment.depth)

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
            sort,
          })
        }
      }}
      py="2"
      style={[
        styles.main(comment.depth, coloredComments, themeOled) as ViewStyle,
        style,
      ]}
    >
      {isPending ? (
        <Spinner color={color} />
      ) : (
        <Text color={color} size="2" weight="medium">
          {t('label', {
            count: comment.count,
          })}
        </Text>
      )}
    </Pressable>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: (depth: number, colored: boolean, oled: boolean) => {
    const color = getDepthColor(depth)

    const marginLeft = theme.space[oled ? 1 : 2] * depth

    const base: UnistylesValues = {
      backgroundColor: colored
        ? theme.colors[color][oled ? 'bg' : 'bgAlt']
        : oled
          ? oledTheme[theme.name].bg
          : theme.colors.gray.bgAlt,
      borderLeftColor: depth > 0 ? theme.colors[color].border : undefined,
      borderLeftWidth: depth > 0 ? theme.space[1] / (oled ? 2 : 1) : undefined,
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
