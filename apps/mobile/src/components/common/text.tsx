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
  slow?: boolean
  style?: StyleProp<TextStyle>
}

export function Text({
  children,
  lines,
  onPress,
  slow,
  style,
  ...props
}: Props) {
  const { styles } = useStyles(stylesheet)

  if (onPress ?? slow) {
    return (
      <ReactNativeText
        allowFontScaling={false}
        ellipsizeMode={lines ? 'tail' : undefined}
        numberOfLines={lines}
        onPress={onPress}
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
    style: [styles.main(props), style],
  })
}

const stylesheet = createStyleSheet((theme) => ({
  main: getTextStyles(theme),
}))
