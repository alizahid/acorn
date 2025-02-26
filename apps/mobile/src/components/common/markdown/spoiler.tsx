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
        setVisible((previous) => !previous)
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
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.orange.accent,
    color: theme.colors.orange.accent,
  },
}))
