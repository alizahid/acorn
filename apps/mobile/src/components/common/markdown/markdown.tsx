/* eslint-disable react/no-array-index-key -- go away */

import { Image as ExpoImage } from 'expo-image'
import { type Nodes } from 'mdast-util-from-markdown/lib'
import { type Table } from 'mdast-util-gfm-table/lib'
import { type StyleProp, type TextStyle, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { useCommon } from '~/hooks/common'
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
  margin?: number
  meta?: PostMediaMeta
  node: Nodes
  recyclingKey?: string
  size?: TypographyToken
  style?: StyleProp<ViewStyle>
  table?: TableProps
  text?: TextProps
}

export function Node({ node, ...props }: Props) {
  const common = useCommon()

  const { styles, theme } = useStyles(stylesheet)

  const handleLink = useLink()

  if (node.type === 'blockquote') {
    return (
      <View style={styles.blockQuote}>
        <View style={styles.blockQuoteBorder} />

        {node.children.map((child, index) => (
          <Node {...props} key={index} node={child} />
        ))}
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

  if (node.type === 'image') {
    const media = findMedia({
      frameWidth: common.frame.width,
      meta: props.meta,
      url: node.url,
    })

    if (media) {
      return (
        <ExpoImage
          recyclingKey={props.recyclingKey}
          source={media.url}
          style={styles.media(media.height, media.width)}
        />
      )
    }

    return (
      <ExpoImage
        recyclingKey={props.recyclingKey}
        source={node.url}
        style={styles.image(common.frame.width)}
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
    const media = findMedia({
      frameWidth: common.frame.width,
      meta: props.meta,
      url: node.url,
    })

    if (media) {
      const caption = getText(node.children)

      return (
        <Media
          caption={caption === node.url ? undefined : caption}
          margin={props.margin}
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
            handleLink(node.url)
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
      <View style={styles.table}>
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
    )
  }

  if (node.type === 'tableCell') {
    return node.children.map((child, index) => (
      <View key={index} style={styles.tableCell}>
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
      <View
        style={[styles.tableRow, Boolean(props.table?.index) && styles.divider]}
      >
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

  if (node.type === 'textDirective' && node.name === 'spoiler') {
    const spoiler = getText(node.children)

    if (!spoiler) {
      return null
    }

    return <Spoiler size={props.size}>{spoiler}</Spoiler>
  }

  if (node.type === 'thematicBreak') {
    return <View style={styles.thematicBreak} />
  }

  if (__DEV__) {
    // eslint-disable-next-line no-console -- go away
    console.log(`Markdown not available: ${node.type}`, JSON.stringify(node))
  } else {
    Sentry.captureMessage(`Markdown not available: ${node.type}`)
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
  divider: {
    borderTopColor: theme.colors.gray.a6,
    borderTopWidth: 1,
  },
  emphasis: {
    fontStyle: 'italic',
  },
  image: (maxWidth: number) => ({
    maxWidth,
  }),
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
  media: (height: number, width: number) => ({
    height,
    transform: [
      {
        translateY: 3,
      },
    ],
    width,
  }),
  table: {
    borderColor: theme.colors.gray.a6,
    borderCurve: 'continuous',
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
  thematicBreak: {
    backgroundColor: theme.colors.gray.a6,
    height: 1,
  },
}))
