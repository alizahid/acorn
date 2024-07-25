import Component, { renderRules } from 'react-native-markdown-display'
import { useSafeAreaFrame } from 'react-native-safe-area-context'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { findImage } from '~/lib/image'
import { getTextStyles, type TextStyleProps } from '~/styles/text'
import { type PostMediaMeta } from '~/types/post'

import { MarkdownImage } from './image'

type Props = TextStyleProps & {
  children: string
  margin?: number
  meta?: PostMediaMeta
}

export function Markdown({ children, margin = 0, meta, ...props }: Props) {
  const frame = useSafeAreaFrame()

  const { styles } = useStyles(stylesheet)

  return (
    <Component
      rules={{
        link(node, ...rest) {
          const image = findImage({
            href: String(node.attributes.href),
            meta,
            width: frame.width - margin * 2,
          })

          if (image) {
            return (
              <MarkdownImage
                caption={node.children[0].content}
                image={image}
                key={node.key}
              />
            )
          }

          return renderRules.link?.(node, ...rest)
        },
        text(node, ...rest) {
          const image = findImage({
            href: node.content,
            meta,
            width: frame.width - margin * 2,
          })

          if (image) {
            return <MarkdownImage image={image} key={node.key} />
          }

          return renderRules.text?.(node, ...rest)
        },
      }}
      style={{
        body: styles.main(props),
        link: styles.link,
      }}
    >
      {children}
    </Component>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  link: {
    color: theme.colors.accentA[11],
    textDecorationLine: 'none',
  },
  main: getTextStyles(theme),
}))
