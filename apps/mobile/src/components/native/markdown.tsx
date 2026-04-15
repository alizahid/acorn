import { Markdown, MarkdownEditor } from 'react-native-fast-markdown'
import { withUnistyles } from 'react-native-unistyles'

export const MarkdownViewer = withUnistyles(Markdown)

export const MarkdownInput = withUnistyles(MarkdownEditor, (theme) => ({
  cursorColor: theme.colors.accent.accent,
  placeholderTextColor: theme.colors.gray.accent,
  styles: {
    link: {
      color: theme.colors.accent.accent,
    },
    spoiler: {
      backgroundColor: theme.colors.accent.accent,
    },
    strikethrough: {
      textDecorationColor: theme.colors.red.accent,
    },
  },
}))
