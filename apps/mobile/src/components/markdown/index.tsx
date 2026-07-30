import { useMemo } from 'react'
import { Gallery } from 'react-native-jet-gallery'
import { StyleSheet } from 'react-native-unistyles'
import { useShallow } from 'zustand/react/shallow'

import { useImageActions } from '~/hooks/image'
import { useLink } from '~/hooks/link'
import { type Font, fonts } from '~/lib/fonts'
import { mergeMetaMarkdown } from '~/lib/markdown'
import { usePreferences } from '~/stores/preferences'
import { addTextSize } from '~/styles/text'
import { radius, type TypographyToken } from '~/styles/tokens'
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
    fontBold,
    fontScaling,
    fontSizePostBody,
    fontSizeCommentBody,
    systemScaling,
  } = usePreferences(
    useShallow((state) => ({
      font: state.font,
      fontBold: state.fontBold,
      fontScaling: state.fontScaling,
      fontSizeCommentBody: state.fontSizeCommentBody,
      fontSizePostBody: state.fontSizePostBody,
      systemScaling: state.systemScaling,
    })),
  )

  const markdown = useMemo(
    () => mergeMetaMarkdown(children, meta),
    [children, meta],
  )

  const { handleLink } = useLink()

  const { actions } = useImageActions()

  const size = type === 'post' ? fontSizePostBody : fontSizeCommentBody

  return (
    <MarkdownViewer
      allowFontScaling={systemScaling}
      markdown={markdown}
      onImagePress={(image) => {
        Gallery.open({
          actions,
          images: [
            {
              url: image.url,
            },
          ],
          origin: {
            ...image,
            borderRadius: radius[4],
          },
        })
      }}
      onLinkPress={(event) => {
        handleLink(event.url)
      }}
      style={styles.main(font, systemScaling ? 1 : fontScaling, fontBold, size)}
      uniProps={(theme) => ({
        styles: {
          blockQuote: {
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
          headings: {
            h1: {
              ...theme.typography[addTextSize(size, 3)],
              fontWeight: '600' as const,
            },
            h2: {
              ...theme.typography[addTextSize(size, 2)],
              fontWeight: '600' as const,
            },
            h3: {
              ...theme.typography[addTextSize(size, 1)],
              fontWeight: '600' as const,
            },
          },
          image: {
            backgroundColor: theme.colors.gray.ui,
            borderRadius: theme.radius[4],
          },
          link: {
            color: theme.colors.accent.accent,
          },
          list: {
            marginLeft: theme.space[1],
          },
          listMarker: {
            color: theme.colors.gray.textLow,
            width: theme.space[4],
          },
          spoiler: {
            backgroundColor: theme.colors.accent.accent,
            borderRadius: theme.radius[2],
          },
          strikethrough: {
            textDecorationColor: theme.colors.red.accent,
          },
          table: {
            backgroundColor: theme.colors.gray.bgAltAlpha,
            borderCurve: 'continuous',
            borderRadius: theme.radius[4],
          },
          tableCell: {
            ...theme.typography[addTextSize(size, -1)],
            borderColor: theme.colors.gray.border,
            borderWidth: StyleSheet.hairlineWidth,
            padding: theme.space[2],
          },
          thematicBreak: {
            backgroundColor: theme.colors.gray.border,
            height: StyleSheet.hairlineWidth,
            marginVertical: theme.space[3],
          },
        },
      })}
    />
  )
}

const styles = StyleSheet.create((theme) => ({
  main: (
    font: Font,
    scaling: number,
    bold: boolean,
    size: TypographyToken,
  ) => ({
    color: theme.colors.gray.text,
    fontFamily: fonts[font],
    fontSize: theme.typography[size].fontSize * scaling,
    fontWeight: bold ? 'bold' : undefined,
    gap: theme.space[3],
    lineHeight: theme.typography[size].lineHeight * scaling,
  }),
}))
