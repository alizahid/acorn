/* eslint-disable react/no-array-index-key -- go away */

import { Image } from 'expo-image'
import { type Nodes } from 'mdast'
import { ScrollView, type TextStyle, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { useLink } from '~/hooks/link'
import { getText } from '~/lib/markdown'
import { Sentry } from '~/lib/sentry'
import { type TextStyleProps } from '~/styles/text'
import { type TypographyToken } from '~/styles/tokens'
import { type PostMediaMeta } from '~/types/post'

import { Text } from '../text'
import { View } from '../view'
import { type MarkdownVariant } from '.'
import { Code } from './code'
import { findMedia, Media } from './media'
import { Spoiler } from './spoiler'

type TextProps = Pick<
  TextStyleProps,
  'align' | 'color' | 'italic' | 'weight'
> & {
  onPress?: () => void
  style?: TextStyle
}

type ListProps = {
  index?: number
  ordered?: boolean
}

type Props = {
  list?: ListProps
  meta?: PostMediaMeta
  node: Nodes
  recyclingKey?: string
  size?: TypographyToken
  style?: ViewStyle
  text?: TextProps
  variant: MarkdownVariant
}

export function Node({ node, ...props }: Props) {
  const { styles, theme } = useStyles(stylesheet)

  const { handleLink } = useLink()

  if (node.type === 'blockquote') {
    return (
      <View style={styles.blockQuote}>
        <View style={styles.blockQuoteBorder} />

        <View style={styles.blockQuoteContent}>
          {node.children.map((child, index) => (
            <Node {...props} key={index} node={child} />
          ))}
        </View>
      </View>
    )
  }

  if (node.type === 'break') {
    return (
      <Text size={props.size} slow>
        {'\n'}
      </Text>
    )
  }

  if (node.type === 'code') {
    return (
      <Code language={node.lang ?? 'text'} size={props.size}>
        {node.value}
      </Code>
    )
  }

  if (node.type === 'delete') {
    return node.children.map((child, index) => (
      <Node
        {...props}
        key={index}
        node={child}
        text={{
          style: styles.delete,
        }}
      />
    ))
  }

  if (node.type === 'emphasis') {
    return node.children.map((child, index) => (
      <Node
        {...props}
        key={index}
        node={child}
        text={{
          italic: true,
        }}
      />
    ))
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

    return node.children.map((child, index) => (
      <Node
        {...props}
        key={index}
        node={child}
        size={size in theme.typography ? size : '3'}
        text={{
          weight: 'bold',
        }}
      />
    ))
  }

  if (node.type === 'html') {
    return <Text size={props.size}>{node.value}</Text>
  }

  if (node.type === 'image') {
    const media = findMedia(node.url, props.meta)

    if (media) {
      return (
        <Media
          caption={node.title}
          media={media}
          recyclingKey={props.recyclingKey}
          variant={props.variant}
        />
      )
    }

    return <Image recyclingKey={props.recyclingKey} source={node.url} />
  }

  if (node.type === 'inlineCode') {
    return (
      <Text size={props.size} slow style={styles.inlineCode} variant="mono">
        {node.value}
      </Text>
    )
  }

  if (node.type === 'link') {
    const media = findMedia(node.url, props.meta)

    if (media) {
      const caption = getText(node.children)

      return (
        <Media
          caption={caption === node.url ? undefined : caption}
          media={media}
          recyclingKey={props.recyclingKey}
          variant={props.variant}
        />
      )
    }

    return node.children.map((child, index) => (
      <Node
        {...props}
        key={index}
        node={child}
        text={{
          color: 'accent',
          onPress() {
            void handleLink(node.url)
          },
        }}
      />
    ))
  }

  if (node.type === 'list') {
    return (
      <View style={[styles.list, props.style]}>
        {node.children.map((child, index) => (
          <Node
            {...props}
            key={index}
            list={{
              index: (node.start ?? 1) + index,
              ordered: node.ordered ?? false,
            }}
            node={child}
          />
        ))}
      </View>
    )
  }

  if (node.type === 'listItem') {
    const text = node.children.filter((child) => child.type === 'paragraph')
    const list = node.children.filter((child) => child.type === 'list')

    return (
      <>
        <View style={styles.listItem}>
          <Text color="accent" size={props.size} tabular>
            {props.list?.ordered ? `${props.list.index ?? 1}.` : '●'}
          </Text>

          {text.map((child, index) => (
            <Node
              {...props}
              key={index}
              node={child}
              text={{
                style: styles.listText,
              }}
            />
          ))}
        </View>

        {list.map((child, index) => (
          <Node {...props} key={index} node={child} style={styles.listNested} />
        ))}
      </>
    )
  }

  if (node.type === 'paragraph') {
    if (node.children.length === 1) {
      return node.children.map((child, index) => (
        <Node {...props} key={index} node={child} />
      ))
    }

    return (
      <Text size={props.size} slow {...props.text}>
        {node.children.map((child, index) => (
          <Node {...props} key={index} node={child} />
        ))}
      </Text>
    )
  }

  if (node.type === 'strong') {
    return node.children.map((child, index) => (
      <Node
        {...props}
        key={index}
        node={child}
        text={{
          weight: 'bold',
        }}
      />
    ))
  }

  if (node.type === 'table') {
    return (
      <ScrollView horizontal style={styles.table}>
        <View responder>
          {node.children.map((row, rowIndex) => (
            <View
              direction="row"
              key={rowIndex}
              style={styles.tableRow(rowIndex > 0)}
            >
              {row.children.map((cell, cellIndex) => (
                <View key={cellIndex} style={styles.tableCell}>
                  {cell.children.map((item, index) => (
                    <Node
                      key={index}
                      node={item}
                      size={props.size}
                      variant="comment"
                    />
                  ))}
                </View>
              ))}

              {row.children.length === 1 ? (
                <View style={styles.tableCell} />
              ) : null}
            </View>
          ))}
        </View>
      </ScrollView>
    )
  }

  if (node.type === 'text') {
    return (
      <Text size={props.size} slow {...props.text}>
        {node.value}
      </Text>
    )
  }

  if (node.type === 'textDirective') {
    if (node.name === 'spoiler') {
      const text = getText(node.children)

      if (!text) {
        return null
      }

      return <Spoiler size={props.size}>{text}</Spoiler>
    }

    if (node.name === 'super_script') {
      const text = getText(node.children)

      if (!text) {
        return null
      }

      return (
        <Text size={props.size} style={styles.super}>
          {text}
        </Text>
      )
    }

    return (
      <Text size={props.size} slow>
        :{node.name}
      </Text>
    )
  }

  if (node.type === 'thematicBreak') {
    return <View style={styles.thematicBreak} />
  }

  if (__DEV__) {
    // eslint-disable-next-line no-console -- go away
    console.log(`Markdown not available: ${node.type}`, JSON.stringify(node))
  } else {
    Sentry.captureMessage('Markdown not available', {
      extra: {
        node,
      },
    })
  }

  return null
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  blockQuote: {
    flexDirection: 'row',
    paddingHorizontal: theme.space[3],
    paddingVertical: theme.space[1],
  },
  blockQuoteBorder: {
    backgroundColor: theme.colors.accent.border,
    borderCurve: 'continuous',
    borderRadius: theme.radius[1],
    bottom: 0,
    left: 0,
    position: 'absolute',
    top: 0,
    width: theme.space[1],
  },
  blockQuoteContent: {
    gap: theme.space[3],
  },
  delete: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  inlineCode: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.gray.bgAlt,
    borderCurve: 'continuous',
    borderRadius: theme.radius[2],
  },
  list: {
    gap: theme.space[2],
  },
  listItem: {
    flexDirection: 'row',
    gap: theme.space[2],
  },
  listNested: {
    marginLeft: theme.space[3],
  },
  listText: {
    flexShrink: 1,
  },
  super: {
    fontSize: 12,
    lineHeight: 14,
  },
  table: {
    backgroundColor: theme.name === 'dark' ? '#0d1117' : '#fff',
    borderColor: theme.colors.gray.border,
    borderCurve: 'continuous',
    borderRadius: theme.radius[4],
    borderWidth: runtime.hairlineWidth,
  },
  tableCell: {
    flexDirection: 'row',
    paddingHorizontal: theme.space[3],
    paddingVertical: theme.space[2],
    width: (runtime.screen.width - theme.space[5]) / 2,
  },
  tableRow: (divider: boolean) => ({
    borderTopColor: divider ? theme.colors.gray.border : undefined,
    borderTopWidth: divider ? runtime.hairlineWidth : undefined,
  }),
  thematicBreak: {
    backgroundColor: theme.colors.gray.border,
    height: 1,
  },
}))
