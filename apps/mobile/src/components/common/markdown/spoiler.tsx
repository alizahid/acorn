import { useState } from 'react'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { type TypographyToken } from '~/styles/tokens'

import { Text } from '../text'

type SpoilerProps = {
  children: string
  size?: TypographyToken
}

export function Spoiler({ children, size = '3' }: SpoilerProps) {
  const { styles } = useStyles(stylesheet)

  const [visible, setVisible] = useState(false)

  return (
    <Text
      onPress={() => {
        setVisible(true)
      }}
      size={size}
      style={!visible ? styles.main : undefined}
    >
      {children}
    </Text>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: {
    backgroundColor: theme.colors.accent[9],
    color: theme.colors.accent[9],
  },
}))
