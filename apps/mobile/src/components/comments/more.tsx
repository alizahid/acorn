import { type StyleProp, type ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
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

  const { colorfulComments, themeOled } = usePreferences()

  styles.useVariants({
    colorful: colorfulComments,
    iPad,
    oled: themeOled,
  })

  const { isPending, loadMore } = useLoadMoreComments()

  const color = getDepthColor(comment.depth)

  return (
    <Pressable
      align="center"
      direction="row"
      disabled={isPending}
      gap="4"
      justify="center"
      label={t('label', {
        count: comment.children.length,
      })}
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
      style={[styles.main(comment.depth), style]}
    >
      {isPending ? (
        <Spinner color={color} />
      ) : (
        <Text color={color} size="2" weight="medium">
          {t('label', {
            count: comment.children.length,
          })}
        </Text>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create((theme) => ({
  main: (depth: number) => {
    const color = getDepthColor(depth)
    const marginLeft = theme.space[2] * depth

    return {
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
      ],
      marginLeft,
      overflow: 'hidden',
      variants: {
        colorful: {
          true: {
            backgroundColor: theme.colors[color].bgAlt,
          },
        },
        iPad: {
          true: {
            alignSelf: 'center',
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
}))
