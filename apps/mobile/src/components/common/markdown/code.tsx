/* eslint-disable react/no-array-index-key -- go away */

import { type ElementContent, type RootContent } from 'hast'
import { common, createLowlight } from 'lowlight'
import { useMemo } from 'react'
import { ScrollView, type TextStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { type TypographyToken } from '~/styles/tokens'

import { Text } from '../text'
import { View } from '../view'

type Props = {
  children: string
  language: string
  size?: TypographyToken
}

const lowlight = createLowlight(common)

export function Code({ children, language, size }: Props) {
  const { styles, theme } = useStyles(stylesheet)

  const root = useMemo(
    () => lowlight.highlight(language, children.trim()),
    [children, language],
  )

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      horizontal
      style={styles.main}
    >
      <View responder>
        <Text size={size} slow variant="mono">
          {root.children.map((node, index) => (
            <Node
              dark={theme.name === 'dark'}
              key={index}
              node={node}
              size={size}
            />
          ))}
        </Text>
      </View>
    </ScrollView>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  content: {
    paddingHorizontal: theme.space[3],
    paddingVertical: theme.space[2],
  },
  main: {
    backgroundColor: theme.name === 'dark' ? '#0d1117' : '#fff',
    borderCurve: 'continuous',
    borderRadius: theme.radius[4],
  },
}))

type NodeProps = {
  dark: boolean
  node: RootContent
  size?: TypographyToken
}

function Node({ dark, node, size }: NodeProps) {
  if (node.type === 'comment') {
    return null
  }

  if (node.type === 'doctype') {
    return null
  }

  if (node.type === 'element') {
    return node.children.map((child, index) => (
      <Element
        dark={dark}
        key={index}
        node={child}
        size={size}
        style={getStyles(dark, String(node.properties.className))}
      />
    ))
  }

  return (
    <Text size={size} slow style={getStyles(dark)} variant="mono">
      {node.value}
    </Text>
  )
}

type ElementProps = {
  dark: boolean
  node: ElementContent
  size?: TypographyToken
  style?: TextStyle
}

function Element({ dark, node, size, style }: ElementProps) {
  if (node.type === 'comment') {
    return null
  }

  if (node.type === 'element') {
    return node.children.map((child, index) => (
      <Element
        dark={dark}
        key={index}
        node={child}
        size={size}
        style={getStyles(dark, String(node.properties.className))}
      />
    ))
  }

  return (
    <Text size={size} slow style={style} variant="mono">
      {node.value}
    </Text>
  )
}

function getStyles(dark: boolean, className = ''): TextStyle {
  if (dark) {
    if (
      className.includes('hljs-doctag') ||
      className.includes('hljs-keyword') ||
      className.includes('hljs-template-tag') ||
      className.includes('hljs-template-variable') ||
      className.includes('hljs-type') ||
      className.includes('hljs-variable')
    ) {
      return {
        color: '#ff7b72',
      }
    }

    if (className.includes('hljs-title')) {
      return {
        color: '#d2a8ff',
      }
    }

    if (
      className.includes('hljs-attr') ||
      className.includes('hljs-attribute') ||
      className.includes('hljs-literal') ||
      className.includes('hljs-meta') ||
      className.includes('hljs-number') ||
      className.includes('hljs-operator') ||
      className.includes('hljs-variable') ||
      className.includes('hljs-selector-attr') ||
      className.includes('hljs-selector-class') ||
      className.includes('hljs-selector-id')
    ) {
      return {
        color: '#79c0ff',
      }
    }

    if (
      className.includes('hljs-regexp') ||
      className.includes('hljs-string')
    ) {
      return {
        color: '#a5d6ff',
      }
    }

    if (
      className.includes('hljs-built_in') ||
      className.includes('hljs-symbol')
    ) {
      return {
        color: '#ffa657',
      }
    }

    if (
      className.includes('hljs-comment') ||
      className.includes('hljs-code') ||
      className.includes('hljs-formula')
    ) {
      return {
        color: '#8b949e',
      }
    }

    if (
      className.includes('hljs-name') ||
      className.includes('hljs-quote') ||
      className.includes('hljs-selector-tag') ||
      className.includes('hljs-selector-pseudo')
    ) {
      return {
        color: '#7ee787',
      }
    }

    if (className.includes('hljs-subst')) {
      return {
        color: '#c9d1d9',
      }
    }

    if (className.includes('hljs-section')) {
      return {
        color: '#1f6feb',
        fontFamily: 'mono-bold',
      }
    }

    if (className.includes('hljs-bullet')) {
      return {
        color: '#f2cc60',
      }
    }

    if (className.includes('hljs-emphasis')) {
      return {
        color: '#c9d1d9',
      }
    }

    if (className.includes('hljs-strong')) {
      return {
        color: '#c9d1d9',
        fontFamily: 'mono-bold',
      }
    }

    if (className.includes('hljs-addition')) {
      return {
        backgroundColor: '#033a16',
        color: '#aff5b4',
      }
    }

    if (className.includes('hljs-deletion')) {
      return {
        backgroundColor: '#67060c',
        color: '#ffdcd7',
      }
    }

    return {
      color: '#c9d1d9',
    }
  }

  if (
    className.includes('hljs-doctag') ||
    className.includes('hljs-keyword') ||
    className.includes('hljs-template-tag') ||
    className.includes('hljs-template-variable') ||
    className.includes('hljs-type') ||
    className.includes('hljs-variable')
  ) {
    return {
      color: '#d73a49',
    }
  }

  if (className.includes('hljs-title')) {
    return {
      color: '#6f42c1',
    }
  }

  if (
    className.includes('hljs-attr') ||
    className.includes('hljs-attribute') ||
    className.includes('hljs-literal') ||
    className.includes('hljs-meta') ||
    className.includes('hljs-number') ||
    className.includes('hljs-operator') ||
    className.includes('hljs-variable') ||
    className.includes('hljs-selector-attr') ||
    className.includes('hljs-selector-class') ||
    className.includes('hljs-selector-id')
  ) {
    return {
      color: '#005cc5',
    }
  }

  if (className.includes('hljs-regexp') || className.includes('hljs-string')) {
    return {
      color: '#032f62',
    }
  }

  if (
    className.includes('hljs-built_in') ||
    className.includes('hljs-symbol')
  ) {
    return {
      color: '#e36209',
    }
  }

  if (
    className.includes('hljs-comment') ||
    className.includes('hljs-code') ||
    className.includes('hljs-formula')
  ) {
    return {
      color: '#6a737d',
    }
  }

  if (
    className.includes('hljs-name') ||
    className.includes('hljs-quote') ||
    className.includes('hljs-selector-tag') ||
    className.includes('hljs-selector-pseudo')
  ) {
    return {
      color: '#22863a',
    }
  }

  if (className.includes('hljs-subst')) {
    return {
      color: '#24292e',
    }
  }

  if (className.includes('hljs-section')) {
    return {
      color: '#005cc5',
      fontFamily: 'mono-bold',
    }
  }

  if (className.includes('hljs-bullet')) {
    return {
      color: '#735c0f',
    }
  }

  if (className.includes('hljs-emphasis')) {
    return {
      color: '#24292e',
    }
  }

  if (className.includes('hljs-strong')) {
    return {
      color: '#24292e',
      fontFamily: 'mono-bold',
    }
  }

  if (className.includes('hljs-addition')) {
    return {
      backgroundColor: '#f0fff4',
      color: '#22863a',
    }
  }

  if (className.includes('hljs-deletion')) {
    return {
      backgroundColor: '#ffeef0',
      color: '#b31d28',
    }
  }

  return {
    color: '#24292e',
  }
}
