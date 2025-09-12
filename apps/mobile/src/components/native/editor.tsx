import { EnrichedTextInput } from 'react-native-enriched'
import { withUnistyles } from 'react-native-unistyles'

export const Editor = withUnistyles(EnrichedTextInput, (theme) => ({
  htmlStyle: {
    a: {
      color: theme.colors.accent.accent,
    },
    ol: {
      gapWidth: theme.space[3],
      marginLeft: theme.space[2],
      markerColor: theme.colors.gray.accent,
    },
    ul: {
      bulletColor: theme.colors.gray.accent,
      bulletSize: theme.space[2],
      gapWidth: theme.space[3],
      marginLeft: theme.space[2],
    },
  },
  placeholderTextColor: theme.colors.gray.accent,
  selectionColor: theme.colors.accent.accent,
}))
