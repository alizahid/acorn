import { createElement, type ReactNode } from 'react'
import {
  Text as ReactNativeText,
  type StyleProp,
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
  const { font, fontScaling, systemScaling } = usePreferences()

  const { styles } = useStyles(stylesheet)

  if (onPress ?? slow) {
    return (
      <ReactNativeText
        allowFontScaling={systemScaling}
        ellipsizeMode={lines ? 'tail' : undefined}
        numberOfLines={lines}
        onPress={onPress}
        selectable={selectable}
        style={[
          styles.main(
            props,
            font,
            systemScaling ? 1 : fontScaling,
          ) as TextStyle,
          style,
        ]}
      >
        {children}
      </ReactNativeText>
    )
  }

  return createElement('RCTText', {
    allowFontScaling: systemScaling,
    children,
    ellipsizeMode: lines ? 'tail' : undefined,
    numberOfLines: lines,
    selectable,
    style: [styles.main(props, font, systemScaling ? 1 : fontScaling), style],
  })
}

const stylesheet = createStyleSheet((theme) => ({
  main: getTextStyles(theme),
}))
