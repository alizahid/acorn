import { useState } from 'react'
import { StyleSheet } from 'react-native-unistyles'

import { type TypographyToken } from '~/styles/tokens'

import { Text } from '../text'

type SpoilerProps = {
  children: string
  size?: TypographyToken
}

export function Spoiler({ children, size = '3' }: SpoilerProps) {
  const [visible, setVisible] = useState(false)

  return (
    <Text
      onPress={() => {
        setVisible((previous) => !previous)
      }}
      size={size}
      style={visible ? undefined : styles.main}
    >
      {children}
    </Text>
  )
}

const styles = StyleSheet.create((theme) => ({
  main: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.orange.accent,
    color: theme.colors.orange.accent,
  },
}))
