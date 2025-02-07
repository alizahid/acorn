import { createElement, type ReactNode } from 'react'
import {
  type StyleProp,
  Text as ReactNativeText,
  type TextStyle,
} from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { usePreferences } from '~/stores/preferences'
import { getTextStyles, type TextStyleProps } from '~/styles/text'

type Props = TextStyleProps & {
  children: ReactNode
  lines?: number
  onPress?: () => void
  selectable?: boolean
  slow?: boolean
  style?: StyleProp<TextStyle>
}

export function Text({
  children,
  lines,
  onPress,
  selectable,
  slow,
  style,
  ...props
}: Props) {
  const { fontScaling, fontSystem } = usePreferences()

  const { styles } = useStyles(stylesheet)

  if (onPress ?? slow) {
    return (
      <ReactNativeText
        allowFontScaling={fontScaling}
        ellipsizeMode={lines ? 'tail' : undefined}
        numberOfLines={lines}
        onPress={onPress}
        selectable={selectable}
        style={[styles.main(props, fontSystem) as TextStyle, style]}
      >
        {children}
      </ReactNativeText>
    )
  }

  // eslint-disable-next-line react/no-children-prop -- go away
  return createElement('RCTText', {
    allowFontScaling: fontScaling,
    children,
    ellipsizeMode: lines ? 'tail' : undefined,
    numberOfLines: lines,
    selectable,
    style: [styles.main(props, fontSystem), style],
  })
}

const stylesheet = createStyleSheet((theme) => ({
  main: getTextStyles(theme),
}))
