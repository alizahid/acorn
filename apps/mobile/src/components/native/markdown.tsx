import { EnrichedMarkdownTextInput } from 'react-native-enriched-markdown'
import { FastMarkdownView } from 'react-native-fast-markdown'
import { withUnistyles } from 'react-native-unistyles'

export const MarkdownViewer = withUnistyles(FastMarkdownView)

export const MarkdownInput = withUnistyles(
  EnrichedMarkdownTextInput,
  (theme) => ({
    cursorColor: theme.colors.accent.accent,
    markdownStyle: {
      link: {
        color: theme.colors.accent.accent,
      },
      spoiler: {
        backgroundColor: theme.colors.accent.border,
        color: theme.colors.accent.text,
      },
    },
    placeholderTextColor: theme.colors.gray.accent,
  }),
)
