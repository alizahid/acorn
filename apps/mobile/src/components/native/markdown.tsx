import { EnrichedMarkdownTextInput } from 'react-native-enriched-markdown'
import { JetMarkdownView } from 'react-native-jet-markdown'
import { withUnistyles } from 'react-native-unistyles'

export const MarkdownViewer = withUnistyles(JetMarkdownView)

export const MarkdownEditor = withUnistyles(
  EnrichedMarkdownTextInput,
  (theme) => ({
    cursorColor: theme.colors.accent.accent,
    markdownStyle: {
      h1: {
        ...theme.typography[6],
        color: theme.colors.gray.text,
        fontWeight: '700',
      },
      link: {
        color: theme.colors.accent.accent,
      },
      spoiler: {
        backgroundColor: theme.colors.red.border,
        color: theme.colors.red.text,
      },
    },
    placeholderTextColor: theme.colors.gray.accent,
  }),
)
