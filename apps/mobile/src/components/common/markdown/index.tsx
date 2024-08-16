import { useMemo } from 'react'
import { type StyleProp, View, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { parse } from '~/lib/markdown'
import { type TypographyToken } from '~/styles/tokens'
import { type PostMediaMeta } from '~/types/post'

import { Node } from './markdown'

type Props = {
  children: string
  margin?: number
  meta?: PostMediaMeta
  recyclingKey?: string
  size?: TypographyToken
  style?: StyleProp<ViewStyle>
}

export function Markdown({
  children,
  margin = 0,
  meta,
  recyclingKey,
  size = '3',
  style,
}: Props) {
  const { styles } = useStyles(stylesheet)

  const nodes = useMemo(() => parse(children), [children])

  return (
    <View style={[styles.main, style]}>
      {nodes.children.map((node, index) => (
        <Node
          // eslint-disable-next-line react/no-array-index-key -- go away
          key={index}
          margin={margin}
          meta={meta}
          node={node}
          recyclingKey={recyclingKey}
          size={size}
        />
      ))}
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: {
    gap: theme.space[3],
  },
}))
