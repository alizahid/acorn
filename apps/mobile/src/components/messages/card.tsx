import { type StyleProp, View, type ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useFormatter } from 'use-intl'

import { type Message } from '~/types/message'

import { Html } from '../common/html'
import { Text } from '../common/text'

type Props = {
  message: Message
  style?: StyleProp<ViewStyle>
  userId?: string
}

export function MessageCard({ message, style, userId }: Props) {
  const f = useFormatter()

  const self = message.from === userId

  return (
    <View style={[styles.main(self), style]}>
      <View style={styles.content(self)}>
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
    paddingHorizontal: theme.space[2],
    paddingVertical: theme.space[1],
  }),
  main: (self: boolean) => ({
    alignItems: self ? 'flex-end' : 'flex-start',
    alignSelf: self ? 'flex-end' : 'flex-start',
    gap: theme.space[1],
  }),
}))
