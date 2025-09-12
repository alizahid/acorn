import { useMemo } from 'react'
import { type ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { RenderHtml } from '~/components/native/html'
import { type ContentWidthType, useContentWidth } from '~/hooks/content-width'
import { useLink } from '~/hooks/link'
import { fonts } from '~/lib/fonts'
import { mergeHtmlMeta } from '~/lib/html'
import { usePreferences } from '~/stores/preferences'
import { addTextSize } from '~/styles/text'
import { type TypographyToken } from '~/styles/tokens'
import { type PostMediaMeta } from '~/types/post'

import { View } from '../view'
import { models } from './models'
import { renderers } from './renderers'

type Props = {
  children: string
  depth?: number
  meta?: PostMediaMeta
  size?: TypographyToken
  style?: ViewStyle
  type?: ContentWidthType
}

export function Html({
  children,
  meta,
  size = '3',
  style,
  type = 'full',
  depth,
}: Props) {
  const { fontScaling, font } = usePreferences()

  const { handleLink } = useLink()

  const width = useContentWidth({
    depth,
    type,
  })

  const html = useMemo(() => mergeHtmlMeta(children, meta), [children, meta])

  return (
    <View style={style}>
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
              a: {
                onPress(_event, href) {
                  handleLink(href)
                },
              },
              ol: {
                enableRemoveBottomMarginIfNested: false,
                enableRemoveTopMarginIfNested: false,
                markerBoxStyle: {
                  paddingRight: theme.space[1],
                },
                markerTextStyle: {
                  color: theme.colors.accent.textLow,
                  fontSize: theme.typography[size].fontSize * fontScaling,
                  fontVariant: ['tabular-nums'],
                  fontWeight: 'medium',
                  lineHeight: theme.typography[size].lineHeight * fontScaling,
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
                  fontSize: theme.space[5] * fontScaling,
                  lineHeight: theme.space[5] * fontScaling,
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
                marginVertical: theme.space[2],
                paddingLeft: theme.space[3],
              },
              body: {
                color: theme.colors.gray.text,
                fontFamily: fonts[font],
                fontSize: theme.typography[size].fontSize * fontScaling,
                fontVariant: ['no-contextual', 'stylistic-four'],
                lineHeight: theme.typography[size].lineHeight * fontScaling,
                paddingVertical: -theme.space[2],
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
                fontSize: theme.typography[pre].fontSize * fontScaling,
                lineHeight: theme.typography[pre].lineHeight * fontScaling,
                marginTop: theme.space[3],
                textAlign: 'center',
              },
              h1: {
                fontSize: theme.typography[h1].fontSize * fontScaling,
                fontWeight: 'bold',
                lineHeight: theme.typography[h1].lineHeight * fontScaling,
                marginVertical: theme.space[2],
              },
              ol: {
                marginVertical: theme.space[2],
              },
              p: {
                marginVertical: theme.space[2],
              },
              pre: {
                backgroundColor: theme.colors.gray.bgAltAlpha,
                borderRadius: theme.radius[4],
                fontSize: theme.typography[pre].fontSize * fontScaling,
                lineHeight: theme.typography[pre].lineHeight * fontScaling,
                marginVertical: theme.space[2],
                paddingHorizontal: theme.space[3],
                paddingVertical: theme.space[2],
                whiteSpace: 'pre',
              },
              strong: {
                fontWeight: 'bold',
              },
              sup: {
                fontSize: theme.typography[size].fontSize * fontScaling * 0.75,
                lineHeight:
                  theme.typography[size].lineHeight * fontScaling * 0.75,
              },
              table: {
                backgroundColor: theme.colors.gray.bgAltAlpha,
                borderColor: theme.colors.gray.border,
                borderWidth: StyleSheet.hairlineWidth,
                marginVertical: theme.space[2],
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
                marginVertical: theme.space[2],
              },
            },
          }
        }}
      />
    </View>
  )
}
