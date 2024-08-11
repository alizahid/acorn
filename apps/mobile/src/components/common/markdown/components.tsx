/* eslint-disable react/no-array-index-key -- go away */

import { Image as ExpoImage } from 'expo-image'
import {
  Children,
  type PropsWithChildren,
  type ReactNode,
  useState,
} from 'react'
import { type StyleProp, View, type ViewStyle } from 'react-native'
import { useSafeAreaFrame } from 'react-native-safe-area-context'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { handleLink } from '~/lib/link'
import { type Dimensions, getDimensions } from '~/lib/media'
import { type TypographyToken } from '~/styles/tokens'
import { type PostMediaMeta } from '~/types/post'

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

type ImageProps = Props & {
  alt?: string
  margin?: number
  src: string
  title?: string
}

type ListProps = TextProps & {
  start?: number
}

export function Wrapper({ children, style }: Props) {
  const { styles } = useStyles(stylesheet)

  return <View style={[styles.wrapper, style]}>{cleanUp(children)}</View>
}

export function Link({ children, frameWidth, href, meta }: LinkProps) {
  const media = findMedia({
    frameWidth,
    href,
    meta,
  })

  if (media) {
    const caption = (
      Array.isArray(children) ? children[0] === href : children === href
    )
      ? undefined
      : children

    return <MarkdownMedia caption={caption} media={media} />
  }

  return (
    <Text
      color="accent"
      onPress={() => {
        handleLink(href)
      }}
      size="2"
    >
      {children}
    </Text>
  )
}

export function Image({ margin = 0, src }: ImageProps) {
  const frame = useSafeAreaFrame()

  const [dimensions, setDimensions] = useState<Dimensions>()

  return (
    <ExpoImage
      onLoad={(event) => {
        setDimensions(
          getDimensions(frame.width - margin, {
            height: event.source.height,
            width: event.source.width,
          }),
        )
      }}
      source={src}
      style={dimensions}
    />
  )
}

export function BlockQuote({ children }: Props) {
  const { styles } = useStyles(stylesheet)

  return <View style={styles.blockquote}>{children}</View>
}

export function LineBreak({ size }: TextProps) {
  return <Text size={size}>{'\n'}</Text>
}

export function HorizontalRule() {
  const { styles } = useStyles(stylesheet)

  return <View style={styles.hr} />
}

export function Code({ children, size }: TextProps) {
  return (
    <Text code size={size}>
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

export function TableRow({ children }: Props) {
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

export function Spoiler({ children }: Props) {
  const [visible, setVisible] = useState(false)

  const onPress = visible
    ? undefined
    : () => {
        setVisible(true)
      }

  return (
    <Text onPress={onPress}>
      {visible ? children : children?.toString().replaceAll(/./g, '█')}
    </Text>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  blockquote: {
    borderLeftColor: theme.colors.accent.a6,
    borderLeftWidth: 2,
    paddingLeft: theme.space[3],
  },
  del: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  divider: {
    borderTopColor: theme.colors.gray.a6,
    borderTopWidth: 1,
  },
  hr: {
    backgroundColor: theme.colors.gray.a6,
    height: 1,
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

export function cleanUp(children: ReactNode) {
  return Children.toArray(children).filter((node) => typeof node !== 'string')
}

export function fixMarkdown(markdown: string) {
  return markdown.replaceAll(/>!(.*?)!</g, '<Spoiler>$1</Spoiler>')
}
