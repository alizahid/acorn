import { createElement, type ReactNode } from 'react'
import {
  type StyleProp,
  Text as ReactNativeText,
  type TextStyle,
} from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { getTextStyles, type TextStyleProps } from '~/styles/text'

type Props = TextStyleProps & {
  children: ReactNode
  lines?: number
  onPress?: () => void
  selectable?: boolean
  style?: StyleProp<TextStyle>
}

export function Text({
  children,
  lines,
  onPress,
  selectable,
  style,
  ...props
}: Props) {
  const { styles } = useStyles(stylesheet)

  if (onPress) {
    return (
      <ReactNativeText
        allowFontScaling={false}
        ellipsizeMode={lines ? 'tail' : undefined}
        numberOfLines={lines}
        onPress={onPress}
        selectable={selectable}
        style={[styles.main(props), style]}
      >
        {children}
      </ReactNativeText>
    )
  }

  // eslint-disable-next-line react/no-children-prop -- go away
  return createElement('RCTText', {
    children,
    ellipsizeMode: lines ? 'tail' : undefined,
    numberOfLines: lines,
    selectable,
    style: [styles.main(props), style],
  })
}

const stylesheet = createStyleSheet((theme) => ({
  main: getTextStyles(theme),
}))
