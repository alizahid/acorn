import { type CommentDeleted } from '@acorn/reddit'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { useShallow } from 'zustand/react/shallow'

import { getDepthColor } from '~/lib/colors'
import { usePreferences } from '~/stores/preferences'

import { Pressable } from '../common/pressable'
import { Text } from '../common/text'

type Props = {
  comment: CommentDeleted
  onPress: () => void
}

export function CommentDeletedCard({ comment, onPress }: Props) {
  const t = useTranslations('component.comments.deleted')

  const { colorfulComments } = usePreferences(
    useShallow((state) => ({
      colorfulComments: state.colorfulComments,
    })),
  )

  styles.useVariants({
    colorful: colorfulComments,
  })

  const label = t(comment.reason ?? 'deleted')

  return (
    <Pressable
      accessibilityLabel={label}
      onPress={onPress}
      style={styles.main(comment.depth)}
    >
      <Text highContrast={false} italic size="2">
        {label}
      </Text>
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
      marginLeft: theme.space[2] * depth,
      overflow: 'hidden',
      padding: theme.space[3],
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
