import {
  FastMarkdownEditor,
  FastMarkdownView,
} from 'react-native-fast-markdown'
import { withUnistyles } from 'react-native-unistyles'

export const MarkdownViewer = withUnistyles(FastMarkdownView)

export const MarkdownInput = withUnistyles(FastMarkdownEditor, (theme) => ({
  cursorColor: theme.colors.accent.accent,
  placeholderTextColor: theme.colors.gray.accent,
  styles: {
    link: {
      color: theme.colors.accent.accent,
    },
    spoiler: {
      backgroundColor: theme.colors.accent.accent,
      borderRadius: theme.radius[4],
    },
    strikethrough: {
      textDecorationColor: theme.colors.red.accent,
    },
  },
}))
