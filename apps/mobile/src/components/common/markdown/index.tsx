import Component, { renderRules } from 'react-native-markdown-display'
import { useSafeAreaFrame } from 'react-native-safe-area-context'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { findMedia } from '~/lib/markdown'
import { getTextStyles, type TextStyleProps } from '~/styles/text'
import { type PostMediaMeta } from '~/types/post'

import { MarkdownMedia } from './media'

type Props = TextStyleProps & {
  children: string
  margin?: number
  meta?: PostMediaMeta
}

export function Markdown({ children, margin = 0, meta, ...props }: Props) {
  const frame = useSafeAreaFrame()

  const { styles } = useStyles(stylesheet)

  const frameWidth = frame.width - margin

  return (
    <Component
      rules={{
        link(node, ...rest) {
          const media = findMedia({
            frameWidth,
            href: String(node.attributes.href),
            meta,
          })

          if (media) {
            return (
              <MarkdownMedia
                caption={node.children[0].content}
                key={node.key}
                media={media}
              />
            )
          }

          return renderRules.link?.(node, ...rest)
        },
        text(node, ...rest) {
          const media = findMedia({
            frameWidth,
            href: node.content,
            meta,
          })

          if (media) {
            return <MarkdownMedia key={node.key} media={media} />
          }

          return renderRules.text?.(node, ...rest)
        },
      }}
      style={{
        blockquote: styles.blockquote,
        body: styles.body(props),
        bullet_list: styles.bullet_list,
        bullet_list_icon: styles.bullet_list_icon,
        code_block: styles.code_block,
        code_inline: styles.code_inline,
        fence: styles.code_block,
        heading1: styles.heading,
        link: styles.link,
        list_item: styles.list_item,
        ordered_list: styles.ordered_list,
        ordered_list_icon: styles.ordered_list_icon,
        paragraph: styles.paragraph,
        table: styles.table,
        td: styles.td,
        th: styles.th,
        tr: styles.tr,
      }}
    >
      {children}
    </Component>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  blockquote: {
    backgroundColor: theme.colors.gray.a3,
    borderLeftColor: theme.colors.gray.a6,
    borderLeftWidth: 3,
    borderRadius: theme.radius[3],
    marginLeft: 0,
    marginVertical: theme.space[3] / 2,
    paddingHorizontal: theme.space[3] / 2,
  },
  body: getTextStyles(theme),
  bullet_list: {
    marginVertical: theme.space[3] / 2 / 2,
  },
  bullet_list_icon: {
    marginLeft: theme.space[3] / 2,
    marginRight: theme.space[3] / 2,
  },
  code_block: {
    backgroundColor: theme.colors.gray.a3,
    borderColor: theme.colors.gray.a6,
    borderRadius: theme.radius[3],
    fontFamily: 'monospace',
    marginVertical: theme.space[3] / 2,
  },
  code_inline: {
    backgroundColor: theme.colors.gray.a3,
    borderWidth: 0,
    fontFamily: 'monospace',
  },
  heading: {
    fontFamily: 'medium',
    lineHeight: undefined,
  },
  link: {
    color: theme.colors.accent.a11,
    textDecorationLine: 'none',
  },
  list_item: {
    marginVertical: theme.space[3] / 2 / 2,
  },
  ordered_list: {
    marginVertical: theme.space[3] / 2 / 2,
  },
  ordered_list_icon: {
    fontVariant: ['tabular-nums'],
    marginLeft: theme.space[3] / 2,
    marginRight: theme.space[3] / 2,
  },
  paragraph: {
    marginBottom: theme.space[3] / 2,
    marginTop: theme.space[3] / 2,
  },
  table: {
    borderColor: theme.colors.gray.a6,
    borderRadius: theme.radius[3],
    marginVertical: theme.space[3] / 2,
  },
  td: {
    padding: 0,
    paddingHorizontal: theme.space[2],
    paddingVertical: theme.space[1],
  },
  th: {
    padding: 0,
    paddingHorizontal: theme.space[2],
    paddingVertical: theme.space[1],
  },
  tr: {
    borderColor: theme.colors.gray.a6,
  },
}))
