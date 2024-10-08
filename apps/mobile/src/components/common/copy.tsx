import * as Clipboard from 'expo-clipboard'
import { useRef, useState } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { HeaderButton } from '../navigation/header-button'
import { Text } from './text'
import { View } from './view'

type Props = {
  code?: boolean
  style?: StyleProp<ViewStyle>
  value: string
}

export function Copy({ code = true, style, value }: Props) {
  const { styles } = useStyles(stylesheet)

  const timer = useRef<NodeJS.Timeout>()

  const [copied, setCopied] = useState(false)

  return (
    <View align="center" direction="row" style={[styles.main, style]}>
      <Text
        mx="4"
        style={styles.uri}
        variant={code ? 'mono' : 'sans'}
        weight="medium"
      >
        {value}
      </Text>

      <HeaderButton
        color={copied ? 'green' : 'accent'}
        icon={copied ? 'CheckCircle' : 'Copy'}
        onPress={async () => {
          if (timer.current) {
            clearTimeout(timer.current)
          }

          await Clipboard.setStringAsync(value)

          setCopied(true)

          timer.current = setTimeout(() => {
            setCopied(false)
          }, 3_000)
        }}
      />
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: {
    backgroundColor: theme.colors.gray.a3,
    borderCurve: 'continuous',
    borderRadius: theme.radius[4],
  },
  uri: {
    flex: 1,
  },
}))
