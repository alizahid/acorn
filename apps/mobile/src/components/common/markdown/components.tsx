/* eslint-disable react/no-array-index-key -- go away */

import * as Linking from 'expo-linking'
import { Children, type PropsWithChildren } from 'react'
import { type StyleProp, View, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { type TypographyToken } from '~/styles/tokens'
import { type PostMediaMeta } from '~/types/post'

import { Pressable } from '../pressable'
import { Text } from '../text'
import { findMedia, MarkdownMedia } from './media'

type Props = PropsWithChildren<{
  style?: StyleProp<ViewStyle>
}>

type TextProps = Props & {
  size?: TypographyToken
}

type LinkProps = Props & {
  frameWidth: number
  href: string
  meta?: PostMediaMeta
}

type ListProps = TextProps & {
  start?: number
}

export function Wrapper({ children }: Props) {
  const { styles } = useStyles(stylesheet)

  const nodes = Children.toArray(children).filter(
    (node) => typeof node !== 'string',
  )

  return <View style={styles.wrapper}>{nodes}</View>
}

export function Link({ children, frameWidth, href, meta }: LinkProps) {
  const media = findMedia({
    frameWidth,
    href,
    meta,
  })

  if (media) {
    return <MarkdownMedia caption={children} media={media} />
  }

  return (
    <Pressable
      onPress={() => {
        void Linking.openURL(href)
      }}
    >
      <Text color="accent" size="2">
        {children}
      </Text>
    </Pressable>
  )
}

export function BlockQuote({ children }: Props) {
  const { styles } = useStyles(stylesheet)

  return <View style={styles.blockquote}>{children}</View>
}

export function LineBreak({ size }: TextProps) {
  return <Text size={size}>{'\n'}</Text>
}

export function Code({ children, size }: TextProps) {
  const { styles } = useStyles(stylesheet)

  return (
    <Text size={size} style={styles.code}>
      {children}
    </Text>
  )
}

export function StrikeThrough({ children, size }: TextProps) {
  const { styles } = useStyles(stylesheet)

  return (
    <Text size={size} style={styles.del}>
      {children}
    </Text>
  )
}

export function List({ children, size, start }: ListProps) {
  const { styles } = useStyles(stylesheet)

  return (
    <View style={styles.ol}>
      {Children.toArray(children).map((item, index) => (
        <View key={index} style={styles.li}>
          <Text highContrast={false} size={size} tabular>
            {typeof start === 'number' ? `${index + start}.` : '●'}
          </Text>

          {item}
        </View>
      ))}
    </View>
  )
}

export function CodeBlock({ children }: Props) {
  const { styles } = useStyles(stylesheet)

  return <View style={styles.pre}>{children}</View>
}

export function Table({ children }: Props) {
  const { styles } = useStyles(stylesheet)

  return <View style={styles.table}>{children}</View>
}

export function TableHeader({ children }: Props) {
  const { styles } = useStyles(stylesheet)

  return <TableBody style={styles.thead}>{children}</TableBody>
}

export function TableBody({ children, style }: Props) {
  const { styles } = useStyles(stylesheet)

  return (
    <View style={style}>
      {Children.toArray(children).map((node, index) => (
        <View key={index} style={index > 0 ? styles.divider : undefined}>
          {node}
        </View>
      ))}
    </View>
  )
}

export function TableRow({ children }: PropsWithChildren) {
  const { styles } = useStyles(stylesheet)

  return (
    <View style={styles.tr}>
      {Children.toArray(children).map((node, index) => (
        <View key={index} style={styles.td}>
          {node}
        </View>
      ))}
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  blockquote: {
    borderLeftColor: theme.colors.accent.a6,
    borderLeftWidth: 2,
    paddingLeft: theme.space[3],
  },
  code: {
    fontFamily: 'monospace',
  },
  del: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  divider: {
    borderTopColor: theme.colors.gray.a6,
    borderTopWidth: 1,
  },
  li: {
    flexDirection: 'row',
    gap: theme.space[2],
  },
  ol: {
    gap: theme.space[1],
  },
  pre: {
    backgroundColor: theme.colors.accent.a3,
    borderRadius: theme.radius[4],
    paddingHorizontal: theme.space[3],
    paddingVertical: theme.space[2],
  },
  table: {
    borderColor: theme.colors.gray.a6,
    borderRadius: theme.radius[4],
    borderWidth: 1,
    overflow: 'hidden',
  },
  td: {
    flex: 1,
    paddingHorizontal: theme.space[2],
    paddingVertical: theme.space[1],
  },
  thead: {
    backgroundColor: theme.colors.gray.a3,
  },
  tr: {
    flexDirection: 'row',
  },
  wrapper: {
    gap: theme.space[3],
  },
}))
