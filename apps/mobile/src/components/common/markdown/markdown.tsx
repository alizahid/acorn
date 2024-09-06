/* eslint-disable react/no-array-index-key -- go away */

import { Image } from 'expo-image'
import { type Nodes } from 'mdast-util-from-markdown/lib'
import { type Table } from 'mdast-util-gfm-table/lib'
import {
  ScrollView,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { useLink } from '~/hooks/link'
import { getText } from '~/lib/markdown'
import { Sentry } from '~/lib/sentry'
import { type TextStyleProps } from '~/styles/text'
import { type TypographyToken } from '~/styles/tokens'
import { type PostMediaMeta } from '~/types/post'

import { Text } from '../text'
import { View } from '../view'
import { findMedia, Media } from './media'
import { Spoiler } from './spoiler'

type TextProps = Pick<TextStyleProps, 'align' | 'color' | 'weight'> & {
  onPress?: () => void
  style?: StyleProp<TextStyle>
}

type ListProps = {
  index?: number
  ordered?: boolean
}

type TableProps = {
  align?: Table['align']
  index: number
}

type Props = {
  list?: ListProps
  meta?: PostMediaMeta
  node: Nodes
  recyclingKey?: string
  size?: TypographyToken
  style?: StyleProp<ViewStyle>
  table?: TableProps
  text?: TextProps
}

export function Node({ node, ...props }: Props) {
  const { styles, theme } = useStyles(stylesheet)

  const handleLink = useLink()

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
    return '\n'
  }

  if (node.type === 'code') {
    return (
      <View style={styles.codeBlock}>
        <Text size={props.size} variant="mono">
          {node.value}
        </Text>
      </View>
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
          style: styles.emphasis,
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
    return node.value
  }

  if (node.type === 'image') {
    const media = findMedia(node.url, props.meta)

    if (media) {
      return (
        <Media
          caption={node.title}
          media={media}
          recyclingKey={props.recyclingKey}
        />
      )
    }

    return (
      <Image
        recyclingKey={props.recyclingKey}
        source={node.url}
        style={styles.image}
      />
    )
  }

  if (node.type === 'inlineCode') {
    return (
      <Text size={props.size} variant="mono">
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
    const spoiler = Boolean(
      node.children.find(
        (child) => child.type === 'textDirective' && child.name === 'spoiler',
      ),
    )

    return (
      <Text size={props.size} slow={spoiler} {...props.text}>
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
      <ScrollView contentContainerStyle={styles.table} horizontal>
        <View responder>
          {node.children.map((child, index) => (
            <Node
              {...props}
              key={index}
              node={child}
              table={{
                align: node.align,
                index,
              }}
            />
          ))}
        </View>
      </ScrollView>
    )
  }

  if (node.type === 'tableCell') {
    return node.children.map((child, index) => (
      <View
        flexBasis={1}
        flexGrow={1}
        key={index}
        style={styles.tableCell}
        width={200}
      >
        <Node
          {...props}
          key={index}
          node={child}
          text={{
            align: props.table?.align?.[props.table.index] ?? 'left',
          }}
        />
      </View>
    ))
  }

  if (node.type === 'tableRow') {
    return (
      <View style={styles.tableRow(Boolean(props.table?.index))}>
        {node.children.map((child, index) => (
          <Node {...props} key={index} node={child} table={props.table} />
        ))}
      </View>
    )
  }

  if (node.type === 'text') {
    return (
      <Text size={props.size} {...props.text}>
        {node.value}
      </Text>
    )
  }

  if (node.type === 'textDirective') {
    if (node.name === 'spoiler') {
      const spoiler = getText(node.children)

      if (!spoiler) {
        return null
      }

      return <Spoiler size={props.size}>{spoiler}</Spoiler>
    }

    return `:${node.name}`
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

const stylesheet = createStyleSheet((theme) => ({
  blockQuote: {
    flexDirection: 'row',
    paddingHorizontal: theme.space[3],
    paddingVertical: theme.space[1],
  },
  blockQuoteBorder: {
    backgroundColor: theme.colors.accent.a6,
    borderCurve: 'continuous',
    borderRadius: theme.radius[1],
    bottom: theme.space[1],
    left: 0,
    position: 'absolute',
    top: theme.space[1],
    width: theme.space[1],
  },
  blockQuoteContent: {
    gap: theme.space[3],
  },
  codeBlock: {
    backgroundColor: theme.colors.accent.a3,
    borderCurve: 'continuous',
    borderRadius: theme.radius[4],
    paddingHorizontal: theme.space[3],
    paddingVertical: theme.space[2],
  },
  delete: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  emphasis: {
    fontStyle: 'italic',
  },
  image: {},
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
  table: {
    borderColor: theme.colors.gray.a6,
    borderCurve: 'continuous',
    borderRadius: theme.radius[4],
    borderWidth: 1,
    overflow: 'hidden',
  },
  tableCell: {
    paddingHorizontal: theme.space[2],
    paddingVertical: theme.space[1],
  },
  tableRow: (divider: boolean) => ({
    borderTopColor: divider ? theme.colors.gray.a6 : undefined,
    borderTopWidth: divider ? 1 : undefined,
    flexDirection: 'row',
  }),
  thematicBreak: {
    backgroundColor: theme.colors.gray.a6,
    height: 1,
  },
}))
