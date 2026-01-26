import { type ReactNode } from 'react'
import { StyleSheet } from 'react-native-unistyles'

import {
  RenderEngineProvider,
  RenderHtmlConfigProvider,
} from '~/components/native/html'
import { fonts } from '~/lib/fonts'
import { usePreferences } from '~/stores/preferences'
import { addTextSize } from '~/styles/text'

import { models } from './models'
import { renderers } from './renderers'

type Props = {
  children: ReactNode
}

export function HtmlProvider({ children }: Props) {
  const { fontScaling, font, fontSizeBody, systemScaling } = usePreferences()

  const scaling = systemScaling ? 1 : fontScaling

  return (
    <RenderEngineProvider
      customHTMLElementModels={models}
      systemFonts={Object.values(fonts)}
      uniProps={(theme) => {
        const h1 = addTextSize(fontSizeBody, 2)
        const pre = addTextSize(fontSizeBody, -1)

        return {
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
              fontSize: theme.typography[fontSizeBody].fontSize * scaling,
              fontVariant: ['stylistic-four'],
              lineHeight: theme.typography[fontSizeBody].lineHeight * scaling,
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
              fontSize:
                theme.typography[fontSizeBody].fontSize * scaling * 0.75,
              lineHeight:
                theme.typography[fontSizeBody].lineHeight * scaling * 0.75,
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
    >
      <RenderHtmlConfigProvider
        renderers={renderers}
        uniProps={(theme) => ({
          defaultTextProps: {
            allowFontScaling: systemScaling,
          },
          renderersProps: {
            ol: {
              enableRemoveBottomMarginIfNested: false,
              enableRemoveTopMarginIfNested: false,
              markerBoxStyle: {
                paddingRight: theme.space[1],
              },
              markerTextStyle: {
                color: theme.colors.accent.textLow,
                fontSize: theme.typography[fontSizeBody].fontSize * scaling,
                fontVariant: ['tabular-nums'],
                fontWeight: 'medium',
                lineHeight: theme.typography[fontSizeBody].lineHeight * scaling,
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
        })}
      >
        {children}
      </RenderHtmlConfigProvider>
    </RenderEngineProvider>
  )
}
