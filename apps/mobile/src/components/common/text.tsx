import { createElement, forwardRef, type ReactNode } from 'react'
import {
  type StyleProp,
  Text as ReactNativeText,
  type TextStyle,
  type ViewProps,
} from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { usePreferences } from '~/stores/preferences'
import { getTextStyles, type TextStyleProps } from '~/styles/text'

type Props = TextStyleProps & {
  children: ReactNode
  lines?: number
  onPress?: () => void
  pointerEvents?: ViewProps['pointerEvents']
  slow?: boolean
  style?: StyleProp<TextStyle>
}

export const Text = forwardRef<ReactNativeText, Props>(function Text(
  { children, lines, onPress, slow, style, ...props },
  ref,
) {
  const { fontScaling } = usePreferences()

  const { styles } = useStyles(stylesheet)

  if (onPress ?? slow) {
    return (
      <ReactNativeText
        allowFontScaling={fontScaling}
        ellipsizeMode={lines ? 'tail' : undefined}
        numberOfLines={lines}
        onPress={onPress}
        ref={ref}
        style={[styles.main(props) as TextStyle, style]}
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
    ref,
    style: [styles.main(props), style],
  })
})

const stylesheet = createStyleSheet((theme) => ({
  main: getTextStyles(theme),
}))
