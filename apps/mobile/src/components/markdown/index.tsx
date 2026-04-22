import { useMemo } from 'react'
import { StyleSheet } from 'react-native-unistyles'

import { useImagePreview } from '~/hooks/image'
import { useLink } from '~/hooks/link'
import { type Font, fonts } from '~/lib/fonts'
import { mergeMetaMarkdown } from '~/lib/markdown'
import { usePreferences } from '~/stores/preferences'
import { addTextSize } from '~/styles/text'
import { type TypographyToken } from '~/styles/tokens'
import { type PostMediaMeta } from '~/types/post'

import { MarkdownViewer } from '../native/markdown'

type Props = {
  children: string
  meta?: PostMediaMeta
  type?: 'post' | 'comment'
}

export function Markdown({ children, meta, type = 'post' }: Props) {
  const {
    font,
    fontScaling,
    fontSizePostBody,
    fontSizeCommentBody,
    systemScaling,
  } = usePreferences([
    'font',
    'fontScaling',
    'fontSizeCommentBody',
    'fontSizePostBody',
    'systemScaling',
  ])

  const size = type === 'post' ? fontSizePostBody : fontSizeCommentBody

  const markdown = useMemo(
    () => mergeMetaMarkdown(children, meta),
    [children, meta],
  )

  const { handleLink } = useLink()
  const { preview } = useImagePreview()

  return (
    <MarkdownViewer
      onImagePress={(image) => {
        preview([image])
      }}
      onLinkPress={(event) => {
        handleLink(event.url)
      }}
      style={styles.main(font, systemScaling ? 1 : fontScaling, size)}
      uniProps={(theme) => ({
        styles: {
          blockquote: {
            backgroundColor: theme.colors.accent.ui,
            borderColor: theme.colors.accent.border,
            borderLeftWidth: theme.space[1],
            borderRadius: theme.radius[4],
            padding: theme.space[3],
          },
          code: {
            backgroundColor: theme.colors.accent.ui,
            fontFamily: fonts.mono,
          },
          codeBlock: {
            ...theme.typography[addTextSize(size, -1)],
            backgroundColor: theme.colors.accent.ui,
            borderRadius: theme.radius[4],
            fontFamily: fonts.mono,
            padding: theme.space[3],
          },
          heading1: {
            ...theme.typography[addTextSize(size, 3)],
            fontWeight: '600' as const,
          },
          heading2: {
            ...theme.typography[addTextSize(size, 2)],
            fontWeight: '600' as const,
          },
          heading3: {
            ...theme.typography[addTextSize(size, 1)],
            fontWeight: '600' as const,
          },
          image: {
            backgroundColor: theme.colors.gray.ui,
            borderRadius: theme.radius[4],
          },
          link: {
            color: theme.colors.accent.accent,
          },
          list: {
            gap: theme.space[1],
          },
          listBullet: {
            color: theme.colors.gray.textLow,
          },
          spoiler: {
            backgroundColor: theme.colors.accent.accent,
            borderRadius: theme.radius[2],
          },
          strikethrough: {
            textDecorationColor: theme.colors.red.accent,
          },
          tableCell: {
            ...theme.typography[addTextSize(size, -1)],
            borderColor: theme.colors.gray.border,
            borderWidth: StyleSheet.hairlineWidth,
            padding: theme.space[2],
          },
          tableHeaderCell: {
            fontWeight: '600' as const,
          },
          tableHeaderRow: {
            backgroundColor: theme.colors.gray.ui,
          },
          thematicBreak: {
            backgroundColor: theme.colors.gray.border,
            height: StyleSheet.hairlineWidth,
            marginVertical: theme.space[3],
          },
        },
      })}
    >
      {markdown}
    </MarkdownViewer>
  )
}

const styles = StyleSheet.create((theme) => ({
  main: (font: Font, scaling: number, size: TypographyToken) => ({
    color: theme.colors.gray.text,
    fontFamily: fonts[font],
    fontSize: theme.typography[size].fontSize * scaling,
    gap: theme.space[3],
    lineHeight: theme.typography[size].lineHeight * scaling,
  }),
}))
