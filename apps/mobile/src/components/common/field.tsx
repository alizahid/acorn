import { type ReactNode } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'

import { type MarginProps } from '~/styles/space'

import { Text } from './text'
import { View } from './view'

type Props = {
  children: ReactNode
  error?: ReactNode
  hint?: ReactNode
  label?: ReactNode
  style?: StyleProp<ViewStyle>
} & MarginProps

export function Field({
  children,
  error,
  hint,
  label,
  style,
  ...props
}: Props) {
  return (
    <View gap="1" {...props} style={style}>
      {typeof label === 'string' ? (
        <Text size="2" weight="medium">
          {label}
        </Text>
      ) : (
        label
      )}

      {children}

      {typeof hint === 'string' ? <Text size="2">{hint}</Text> : hint}

      {typeof error === 'string' ? (
        <Text color="red" size="2" weight="medium">
          {error}
        </Text>
      ) : (
        error
      )}
    </View>
  )
}
