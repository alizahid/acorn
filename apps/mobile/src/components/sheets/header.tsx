import { type ReactNode } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Text } from '~/components/common/text'
import { View } from '~/components/common/view'

type Props = {
  right?: ReactNode
  style?: StyleProp<ViewStyle>
  title: string
}

export function SheetHeader({ right, style, title }: Props) {
  const { styles } = useStyles(stylesheet)

  return (
    <View
      align="center"
      height="8"
      justify="center"
      style={[styles.main, style]}
    >
      <Text weight="bold">{title}</Text>

      {right ? <View style={[styles.right]}>{right}</View> : null}
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: {
    backgroundColor: theme.colors.gray[1],
  },
  right: {
    bottom: 0,
    position: 'absolute',
    right: 0,
  },
}))
