import { type StyleProp, type ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useFormatter } from 'use-intl'

import { type Message } from '~/types/message'

import { Html } from '../common/html'
import { Text } from '../common/text'
import { View } from '../common/view'

type Props = {
  message: Message
  style?: StyleProp<ViewStyle>
  userId?: string
}

export function MessageCard({ message, style, userId }: Props) {
  const f = useFormatter()

  const self = message.author === userId

  return (
    <View
      align={self ? 'end' : 'start'}
      gap="1"
      self={self ? 'end' : 'start'}
      style={style}
    >
      <View px="2" py="1" style={styles.content(self)}>
        <Html>{message.body}</Html>
      </View>

      <Text highContrast={false} size="1" tabular>
        {f.dateTime(message.createdAt, {
          timeStyle: 'short',
        })}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  content: (self: boolean) => ({
    backgroundColor: self ? theme.colors.accent.ui : theme.colors.gray.ui,
    borderCurve: 'continuous',
    borderRadius: theme.space[2],
    maxWidth: '90%',
  }),
}))
