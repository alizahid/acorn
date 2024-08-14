/* eslint-disable react/no-array-index-key -- go away */

import { Image as ExpoImage } from 'expo-image'
import { directiveFromMarkdown } from 'mdast-util-directive'
import { fromMarkdown } from 'mdast-util-from-markdown'
import type * as Markdown from 'mdast-util-from-markdown/lib'
import { gfmFromMarkdown } from 'mdast-util-gfm'
import { gfmAutolinkLiteralFromMarkdown } from 'mdast-util-gfm-autolink-literal'
import { gfmStrikethroughFromMarkdown } from 'mdast-util-gfm-strikethrough'
import { gfmTableFromMarkdown } from 'mdast-util-gfm-table'
import { type Table } from 'mdast-util-gfm-table/lib'
import { directive } from 'micromark-extension-directive'
import { gfm } from 'micromark-extension-gfm'
import { gfmAutolinkLiteral } from 'micromark-extension-gfm-autolink-literal'
import { gfmStrikethrough } from 'micromark-extension-gfm-strikethrough'
import { gfmTable } from 'micromark-extension-gfm-table'
import { useState } from 'react'
import {
  type StyleProp,
  type TextStyle,
  View,
  type ViewStyle,
} from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { useLink } from '~/hooks/link'
import { Sentry } from '~/lib/sentry'
import { type TextStyleProps } from '~/styles/text'
import { type TypographyToken } from '~/styles/tokens'
import { type PostMediaMeta } from '~/types/post'

import { Text } from '../text'
import { findMedia, Media } from './media'

type Props = {
  frameWidth: number
  margin?: number
  meta?: PostMediaMeta
  recyclingKey?: string
  size?: TypographyToken
  style?: StyleProp<ViewStyle>
}

export function parse(markdown: string) {
  const value = markdown.replaceAll(/>!(.*?)!</g, ':spoiler[$1]')

  return fromMarkdown(value, {
    extensions: [
      gfm(),
      gfmAutolinkLiteral(),
      gfmStrikethrough(),
      gfmTable(),
      directive(),
    ],
    mdastExtensions: [
      gfmFromMarkdown(),
      gfmAutolinkLiteralFromMarkdown(),
      gfmStrikethroughFromMarkdown(),
      gfmTableFromMarkdown(),
      directiveFromMarkdown(),
    ],
  })
}

type Node = Markdown.Root['children'][number]

function render(node: Node, index: number, props: Props) {
  return <Node {...props} key={index} node={node} />
}

type TextProps = TextStyleProps & {
  onPress?: () => void
  style?: StyleProp<TextStyle>
}

function renderText(
  nodes: Array<Node>,
  props: Props,
  text?: TextProps | false,
) {
  return nodes.map((node, index) => {
    if (node.type === 'text') {
      if (text === false) {
        return node.value
      }

      return (
        <Text key={index} size={props.size} {...text}>
          {node.value}
        </Text>
      )
    }

    return render(node, index, props)
  })
}

type NodeProps = Props & {
  node: Node
}

export function Node({ node, ...props }: NodeProps) {
  const { styles, theme } = useStyles(stylesheet)

  if (node.type === 'paragraph') {
    return <Paragraph {...props}>{node.children}</Paragraph>
  }

  if (node.type === 'link') {
    return (
      <Link {...props} url={node.url}>
        {node.children}
      </Link>
    )
  }

  if (node.type === 'blockquote') {
    return <BlockQuote {...props}>{node.children}</BlockQuote>
  }

  if (node.type === 'strong') {
    return renderText(node.children, props, {
      weight: 'bold',
    })
  }

  if (node.type === 'emphasis') {
    return renderText(node.children, props, {
      weight: 'light',
    })
  }

  if (node.type === 'delete') {
    return renderText(node.children, props, {
      style: styles.strikeThrough,
    })
  }

  if (node.type === 'code') {
    return <CodeBlock {...props} value={node.value} />
  }

  if (node.type === 'inlineCode') {
    return (
      <Text size={props.size} variant="mono">
        {node.value}
      </Text>
    )
  }

  if (node.type === 'heading') {
    const map = {
      1: 6,
      2: 5,
      3: 5,
      4: 4,
      5: 4,
      6: 4,
    } as const

    const difference = 3 - Number(props.size)
    const base = map[node.depth]
    const size = String(base - difference) as TypographyToken

    return renderText(node.children, props, {
      size: size in theme.typography ? size : '3',
      weight: 'bold',
    })
  }

  if (node.type === 'list') {
    return (
      <List {...props} ordered={node.ordered} start={node.start}>
        {node.children}
      </List>
    )
  }

  if (node.type === 'break') {
    return '\n'
  }

  if (node.type === 'table') {
    return (
      <Table {...props} align={node.align}>
        {node.children}
      </Table>
    )
  }

  if (node.type === 'thematicBreak') {
    return <View style={styles.horizontalRule} />
  }

  if (node.type === 'image') {
    return <Image {...props} url={node.url} />
  }

  if (node.type === 'textDirective' && node.name === 'spoiler') {
    return <Spoiler {...props}>{node.children}</Spoiler>
  }

  if (node.type === 'text') {
    return <Text size={props.size}>{node.value}</Text>
  }

  if (__DEV__) {
    // eslint-disable-next-line no-console -- go away
    console.log(
      `Markdown not available: ${node.type}`,
      JSON.stringify(
        node,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- go away
        (key, value) => (key === 'position' ? undefined : value),
        2,
      ),
    )
  } else {
    Sentry.captureMessage(`Markdown not available: ${node.type}`)
  }

  return null
}

type ParagraphProps = Props & Pick<Markdown.Paragraph, 'children'>

function Paragraph({ children, ...props }: ParagraphProps) {
  return <Text size={props.size}>{renderText(children, props, false)}</Text>
}

type LinkProps = Props & Pick<Markdown.Link, 'children' | 'url'>

function Link({ children, url, ...props }: LinkProps) {
  const handleLink = useLink()

  const media = findMedia({
    frameWidth: props.frameWidth,
    meta: props.meta,
    url,
  })

  if (media) {
    const caption = children[0]?.type === 'text' ? children[0].value : undefined

    return (
      <Media
        caption={caption === url ? undefined : caption}
        margin={props.margin}
        media={media}
        recyclingKey={props.recyclingKey}
      />
    )
  }

  return renderText(children, props, {
    color: 'accent',
    onPress() {
      handleLink(url)
    },
  })
}

type BlockQuoteProps = Props & Pick<Markdown.Blockquote, 'children'>

function BlockQuote({ children, ...props }: BlockQuoteProps) {
  const { styles } = useStyles(stylesheet)

  return (
    <View style={styles.blockQuote}>
      {children.map((node, index) => render(node, index, props))}
    </View>
  )
}

type CodeBlockProps = Props & Pick<Markdown.Code, 'value'>

function CodeBlock({ value, ...props }: CodeBlockProps) {
  const { styles } = useStyles(stylesheet)

  return (
    <View style={styles.codeBlock}>
      <Text size={props.size} variant="mono">
        {value}
      </Text>
    </View>
  )
}

type ListProps = Props & Pick<Markdown.List, 'children' | 'ordered' | 'start'>

function List({ children, ordered, start, ...props }: ListProps) {
  const { styles } = useStyles(stylesheet)

  return (
    <View style={styles.list}>
      {children.map((node, index) => (
        <View key={index} style={styles.listItem}>
          <Text color="accent" size={props.size} tabular>
            {ordered ? `${(start ?? 1) + index}.` : '●'}
          </Text>

          {renderText(node.children, props)}
        </View>
      ))}
    </View>
  )
}

type TableProps = Props & Pick<Table, 'align' | 'children'>

function Table({ align, children, ...props }: TableProps) {
  const { styles } = useStyles(stylesheet)

  return (
    <View style={styles.table}>
      {children.map((row, rowIndex) => (
        <View
          key={rowIndex}
          style={[styles.tableRow, rowIndex > 0 && styles.divider]}
        >
          {row.children.map((cell, cellIndex) => (
            <View key={cellIndex} style={styles.tableCell}>
              {renderText(cell.children, props, {
                align: align?.[rowIndex] ?? undefined,
              })}
            </View>
          ))}
        </View>
      ))}
    </View>
  )
}

type ImageProps = Props & Pick<Markdown.Image, 'url'>

function Image({ url, ...props }: ImageProps) {
  const { styles } = useStyles(stylesheet)

  const media = findMedia({
    frameWidth: props.frameWidth,
    meta: props.meta,
    url,
  })

  if (media) {
    return (
      <ExpoImage
        source={media.url}
        style={styles.media(media.height, media.width)}
      />
    )
  }

  return <ExpoImage source={url} style={styles.image(props.frameWidth)} />
}

type SpoilerProps = Props & Pick<Markdown.Paragraph, 'children'>

export function Spoiler({ children, size }: SpoilerProps) {
  const [visible, setVisible] = useState(false)

  const spoiler = children[0]?.type === 'text' ? children[0].value : undefined

  if (!spoiler) {
    return null
  }

  const onPress = visible
    ? undefined
    : () => {
        setVisible(true)
      }

  return (
    <Text key={String(visible)} onPress={onPress} size={size}>
      {visible ? spoiler : spoiler.replaceAll(/./g, '█')}
    </Text>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  blockQuote: {
    borderLeftColor: theme.colors.accent.a6,
    borderLeftWidth: theme.space[1],
    paddingHorizontal: theme.space[3],
    paddingVertical: theme.space[2],
  },
  codeBlock: {
    backgroundColor: theme.colors.accent.a3,
    borderRadius: theme.radius[4],
    paddingHorizontal: theme.space[3],
    paddingVertical: theme.space[2],
  },
  divider: {
    borderTopColor: theme.colors.gray.a6,
    borderTopWidth: 1,
  },
  horizontalRule: {
    backgroundColor: theme.colors.gray.a6,
    height: 1,
  },
  image: (maxWidth: number) => ({
    maxWidth,
  }),
  list: {
    gap: theme.space[1],
  },
  listItem: {
    flexDirection: 'row',
    gap: theme.space[2],
  },
  media: (height: number, width: number) => ({
    height,
    transform: [
      {
        translateY: 3,
      },
    ],
    width,
  }),
  strikeThrough: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  table: {
    borderColor: theme.colors.gray.a6,
    borderRadius: theme.radius[4],
    borderWidth: 1,
    overflow: 'hidden',
  },
  tableCell: {
    flex: 1,
    paddingHorizontal: theme.space[2],
    paddingVertical: theme.space[1],
  },
  tableRow: {
    flexDirection: 'row',
  },
}))
