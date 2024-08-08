/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison -- go away */

import MarkdownToJsx from 'markdown-to-jsx'
import { type PropsWithChildren } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import { useSafeAreaFrame } from 'react-native-safe-area-context'

import { type TypographyToken } from '~/styles/tokens'
import { type PostMediaMeta } from '~/types/post'

import { Text } from '../text'
import {
  BlockQuote,
  Code,
  CodeBlock,
  Image,
  LineBreak,
  Link,
  List,
  StrikeThrough,
  Table,
  TableBody,
  TableHeader,
  TableRow,
  Wrapper,
} from './components'

type Props = {
  children: string
  margin?: number
  meta?: PostMediaMeta
  size?: TypographyToken
  style?: StyleProp<ViewStyle>
}

export function Markdown({ children, margin = 0, meta, size, style }: Props) {
  const frame = useSafeAreaFrame()

  const frameWidth = frame.width - margin

  const props = {
    size,
  }

  return (
    <MarkdownToJsx
      options={{
        forceBlock: true,
        forceWrapper: true,
        overrides: {
          a: {
            component: Link,
            props: {
              frameWidth,
              meta,
              size,
            },
          },
          blockquote: {
            component: BlockQuote,
            props,
          },
          br: {
            component: LineBreak,
          },
          code: {
            component: Code,
            props,
          },
          del: {
            component: StrikeThrough,
            props,
          },
          em: {
            component: Text,
            props,
          },
          h1: {
            component: Text,
            props: {
              size: '6',
              weight: 'bold',
            },
          },
          h2: {
            component: Text,
            props: {
              size: '5',
              weight: 'bold',
            },
          },
          h3: {
            component: Text,
            props: {
              size: '5',
              weight: 'bold',
            },
          },
          h4: {
            component: Text,
            props: {
              size: '4',
              weight: 'bold',
            },
          },
          h5: {
            component: Text,
            props: {
              size: '4',
              weight: 'bold',
            },
          },
          h6: {
            component: Text,
            props: {
              size: '4',
              weight: 'bold',
            },
          },
          image: {
            component: Image,
            props: {
              margin,
            },
          },
          img: {
            component: Image,
            props: {
              margin,
            },
          },
          li: {
            component: Text,
            props,
          },
          ol: {
            component: List,
            props,
          },
          p: {
            component: Text,
            props,
          },
          pre: {
            component: CodeBlock,
            props: {
              type: 'pre',
            },
          },
          span: {
            component: Text,
            props,
          },
          strong: {
            component: Text,
            props: {
              size,
              weight: 'bold',
            },
          },
          sub: {
            component: Text,
            props: {
              size: '1',
              weight: 'light',
            },
          },
          sup: {
            component: Text,
            props: {
              size: '1',
              weight: 'light',
            },
          },
          table: {
            component: Table,
            props: {
              type: 'table',
            },
          },
          tbody: {
            component: TableBody,
          },
          td: {
            component: Text,
            props,
          },
          text: {
            component: Text,
            props,
          },
          th: {
            component: Text,
            props: {
              size,
              weight: 'bold',
            },
          },
          thead: {
            component: TableHeader,
          },
          tr: {
            component: TableRow,
            props: {
              type: 'tr',
            },
          },
          ul: {
            component: List,
            props,
          },
        },
        renderRule(next, node, renderChildren, state) {
          if (
            node.type === '27' &&
            node.text.startsWith('^(') &&
            node.text.endsWith(')')
          ) {
            return (
              <Text key={state.key} size="1" weight="light">
                {node.text.slice(2, -1)}
              </Text>
            )
          }

          return next()
        },
        wrapper: (wrapper: PropsWithChildren) => (
          <Wrapper {...wrapper} style={style} />
        ),
      }}
    >
      {children}
    </MarkdownToJsx>
  )
}
