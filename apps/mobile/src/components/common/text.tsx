import { createElement, type ReactNode } from 'react'
import {
  type LayoutChangeEvent,
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
  onLayout?: (event: LayoutChangeEvent) => void
  onPress?: () => void
  selectable?: boolean
  slow?: boolean
  style?: StyleProp<TextStyle>
}

export function Text({
  children,
  lines,
  onLayout,
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
        onLayout={onLayout}
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

  // eslint-disable-next-line react/no-children-prop -- go away
  return createElement('RCTText', {
    allowFontScaling: systemScaling,
    children,
    ellipsizeMode: lines ? 'tail' : undefined,
    numberOfLines: lines,
    onLayout,
    selectable,
    style: [styles.main(props, font, systemScaling ? 1 : fontScaling), style],
  })
}

const stylesheet = createStyleSheet((theme) => ({
  main: getTextStyles(theme),
}))
