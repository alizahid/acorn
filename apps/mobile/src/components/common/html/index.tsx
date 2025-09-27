import { useMemo } from 'react'
import { StyleSheet } from 'react-native-unistyles'

import { RenderHtml } from '~/components/native/html'
import { type ContentWidthType, useContentWidth } from '~/hooks/content-width'
import { fonts } from '~/lib/fonts'
import { mergeHtmlMeta } from '~/lib/html'
import { usePreferences } from '~/stores/preferences'
import { addTextSize } from '~/styles/text'
import { type TypographyToken } from '~/styles/tokens'
import { type PostMediaMeta } from '~/types/post'

import { models } from './models'
import { renderers } from './renderers'

type Props = {
  children: string
  depth?: number
  meta?: PostMediaMeta
  size?: TypographyToken
  type?: ContentWidthType
}

export function Html({
  children,
  meta,
  size = '3',
  type = 'full',
  depth,
}: Props) {
  const { fontScaling, font, systemScaling } = usePreferences()

  const width = useContentWidth({
    depth,
    type,
  })

  const html = useMemo(() => mergeHtmlMeta(children, meta), [children, meta])

  const scaling = systemScaling ? 1 : fontScaling

  return (
    <RenderHtml
      contentWidth={width}
      customHTMLElementModels={models}
      renderers={renderers}
      source={{
        html,
      }}
      systemFonts={Object.values(fonts)}
      uniProps={(theme) => {
        const h1 = addTextSize(size, 2)
        const pre = addTextSize(size, -1)

        return {
          renderersProps: {
            ol: {
              enableRemoveBottomMarginIfNested: false,
              enableRemoveTopMarginIfNested: false,
              markerBoxStyle: {
                paddingRight: theme.space[1],
              },
              markerTextStyle: {
                color: theme.colors.accent.textLow,
                fontSize: theme.typography[size].fontSize * scaling,
                fontVariant: ['tabular-nums'],
                fontWeight: 'medium',
                lineHeight: theme.typography[size].lineHeight * scaling,
              },
            },
            table: {
              forceStretch: true,
            },
            ul: {
              enableRemoveBottomMarginIfNested: false,
              enableRemoveTopMarginIfNested: false,
              markerBoxStyle: {
                paddingRight: theme.space[1],
              },
              markerTextStyle: {
                color: theme.colors.accent.textLow,
                fontSize: theme.space[5] * scaling,
                lineHeight: theme.space[5] * scaling,
              },
            },
          },
          tagsStyles: {
            a: {
              color: theme.colors.accent.textLow,
            },
            blockquote: {
              borderLeftColor: theme.colors.gray.border,
              borderLeftWidth: theme.space[1],
              marginVertical: theme.space[3] / 2,
              paddingLeft: theme.space[3],
            },
            body: {
              color: theme.colors.gray.text,
              fontFamily: fonts[font],
              fontSize: theme.typography[size].fontSize * scaling,
              fontVariant: ['stylistic-four'],
              lineHeight: theme.typography[size].lineHeight * scaling,
              marginVertical: -(theme.space[3] / 2),
            },
            code: {
              fontFamily: fonts.mono,
            },
            del: {
              textDecorationLine: 'line-through',
            },
            em: {
              fontStyle: 'italic',
            },
            figcaption: {
              color: theme.colors.gray.textLow,
              fontSize: theme.typography[pre].fontSize * scaling,
              lineHeight: theme.typography[pre].lineHeight * scaling,
              marginTop: theme.space[3],
              textAlign: 'center',
            },
            h1: {
              fontSize: theme.typography[h1].fontSize * scaling,
              fontWeight: 'bold',
              lineHeight: theme.typography[h1].lineHeight * scaling,
              marginVertical: theme.space[3] / 2,
            },
            ol: {
              marginVertical: theme.space[3] / 2,
            },
            p: {
              marginVertical: theme.space[3] / 2,
            },
            pre: {
              backgroundColor: theme.colors.gray.bgAltAlpha,
              borderRadius: theme.radius[4],
              fontSize: theme.typography[pre].fontSize * scaling,
              lineHeight: theme.typography[pre].lineHeight * scaling,
              marginVertical: theme.space[3] / 2,
              paddingHorizontal: theme.space[3],
              paddingVertical: theme.space[2],
              whiteSpace: 'pre',
            },
            strong: {
              fontWeight: 'bold',
            },
            sup: {
              fontSize: theme.typography[size].fontSize * scaling * 0.75,
              lineHeight: theme.typography[size].lineHeight * scaling * 0.75,
            },
            table: {
              backgroundColor: theme.colors.gray.bgAltAlpha,
              borderColor: theme.colors.gray.border,
              borderWidth: StyleSheet.hairlineWidth,
              marginVertical: theme.space[3] / 2,
            },
            td: {
              borderColor: theme.colors.gray.border,
              borderWidth: StyleSheet.hairlineWidth,
              paddingHorizontal: theme.space[2],
              paddingVertical: theme.space[1],
            },
            th: {
              borderColor: theme.colors.gray.border,
              borderWidth: StyleSheet.hairlineWidth,
              paddingHorizontal: theme.space[2],
              paddingVertical: theme.space[1],
            },
            ul: {
              marginVertical: theme.space[3] / 2,
            },
          },
        }
      }}
    />
  )
}
