import {
  EnrichedMarkdownInput,
  EnrichedMarkdownText,
} from 'react-native-enriched-markdown'
import { StyleSheet, withUnistyles } from 'react-native-unistyles'

import { fonts } from '~/lib/fonts'
import { usePreferences } from '~/stores/preferences'
import { addTextSize } from '~/styles/text'

const { font, fontSizeBody } = usePreferences.getState()

export const EnrichedMarkdown = withUnistyles(
  EnrichedMarkdownText,
  (theme) => ({
    markdownStyle: {
      blockquote: {
        backgroundColor: theme.colors.accent.ui,
        borderColor: theme.colors.accent.border,
        borderRadius: theme.radius[3],
        borderWidth: theme.space[1],
        color: theme.colors.accent.text,
        fontFamily: fonts[font],
        fontSize: theme.typography[fontSizeBody].fontSize,
        gapWidth: theme.space[2],
        lineHeight: theme.typography[fontSizeBody].lineHeight,
        marginBottom: theme.space[3],
        padding: theme.space[2],
      },
      code: {
        backgroundColor: theme.colors.accent.ui,
        borderColor: 'transparent',
        color: theme.colors.accent.text,
        fontFamily: fonts.mono,
        fontSize: theme.typography[addTextSize(fontSizeBody, -1)].fontSize,
        lineHeight: theme.typography[addTextSize(fontSizeBody, -1)].lineHeight,
      },
      codeBlock: {
        backgroundColor: theme.colors.accent.ui,
        borderRadius: theme.radius[3],
        borderWidth: 0,
        color: theme.colors.gray.text,
        fontFamily: fonts.mono,
        fontSize: theme.typography[addTextSize(fontSizeBody, -1)].fontSize,
        lineHeight: theme.typography[addTextSize(fontSizeBody, -1)].lineHeight,
        marginBottom: theme.space[3],
        padding: theme.space[2],
      },
      h1: {
        color: theme.colors.gray.text,
        fontFamily: fonts[font],
        fontSize: theme.typography[addTextSize(fontSizeBody, 3)].fontSize,
        fontWeight: '600',
        lineHeight: theme.typography[addTextSize(fontSizeBody, 3)].lineHeight,
        marginBottom: theme.space[3],
      },
      h2: {
        color: theme.colors.gray.text,
        fontFamily: fonts[font],
        fontSize: theme.typography[addTextSize(fontSizeBody, 2)].fontSize,
        fontWeight: '500',
        lineHeight: theme.typography[addTextSize(fontSizeBody, 2)].lineHeight,
        marginBottom: theme.space[3],
      },
      h3: {
        color: theme.colors.gray.text,
        fontFamily: fonts[font],
        fontSize: theme.typography[addTextSize(fontSizeBody, 1)].fontSize,
        fontWeight: '500',
        lineHeight: theme.typography[addTextSize(fontSizeBody, 1)].lineHeight,
        marginBottom: theme.space[3],
      },
      image: {
        borderRadius: theme.radius[4],
      },
      link: {
        color: theme.colors.accent.accent,
        underline: false,
      },
      list: {
        bulletColor: theme.colors.gray.accent,
        bulletSize: theme.space[1],
        color: theme.colors.gray.text,
        fontFamily: fonts[font],
        fontSize: theme.typography[fontSizeBody].fontSize,
        gapWidth: theme.space[2],
        lineHeight: theme.typography[fontSizeBody].lineHeight,
        marginBottom: theme.space[3],
        marginLeft: theme.space[4],
        markerColor: theme.colors.gray.accent,
        markerFontWeight: '400',
      },
      paragraph: {
        color: theme.colors.gray.text,
        fontFamily: fonts[font],
        fontSize: theme.typography[fontSizeBody].fontSize,
        lineHeight: theme.typography[fontSizeBody].lineHeight,
        marginBottom: theme.space[3],
      },
      spoiler: {
        color: theme.colors.accent.accent,
        solid: {
          borderRadius: theme.radius[2],
        },
      },
      strikethrough: {
        color: theme.colors.red.accent,
      },
      table: {
        borderColor: theme.colors.gray.border,
        borderRadius: theme.radius[2],
        borderWidth: StyleSheet.hairlineWidth,
        cellPaddingHorizontal: theme.space[2],
        cellPaddingVertical: theme.space[2],
        color: theme.colors.gray.text,
        fontFamily: fonts[font],
        fontSize: theme.typography[fontSizeBody].fontSize,
        headerBackgroundColor: 'transparent',
        headerFontFamily: fonts[font],
        headerTextColor: theme.colors.gray.text,
        lineHeight: theme.typography[fontSizeBody].lineHeight,
        marginBottom: theme.space[3],
        rowEvenBackgroundColor: 'transparent',
        rowOddBackgroundColor: 'transparent',
      },
      thematicBreak: {
        color: theme.colors.gray.border,
        height: StyleSheet.hairlineWidth,
        marginBottom: theme.space[3],
        marginTop: theme.space[3],
      },
    },
  }),
)

export const EnrichedInput = withUnistyles(EnrichedMarkdownInput, (theme) => ({
  cursorColor: theme.colors.accent.accent,
  markdownStyle: {
    link: {
      color: theme.colors.accent.accent,
      underline: false,
    },
    spoiler: {
      backgroundColor: theme.colors.accent.ui,
      color: theme.colors.accent.accent,
    },
  },
  placeholderTextColor: theme.colors.gray.accent,
}))
