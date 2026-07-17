import { type StyleProp, View, type ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useFormatter } from 'use-intl'

import { type Message } from '~/types/message'

import { Text } from '../common/text'
import { Markdown } from '../markdown'

type Props = {
  message: Message
  style?: StyleProp<ViewStyle>
  userId?: string
}

export function MessageCard({ message, style, userId }: Props) {
  const f = useFormatter()

  const mine = message.from === userId

  return (
    <View style={[styles.main(mine), style]}>
      <View style={styles.header}>
        <Text
          color={mine ? 'accent' : undefined}
          highContrast={false}
          size="2"
          weight="medium"
        >
          {message.from}
        </Text>

        <Text highContrast={false} size="1" tabular>
          {f.dateTime(message.createdAt, {
            timeStyle: 'short',
          })}
        </Text>
      </View>

      <Markdown>{message.body}</Markdown>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.space[2],
  },
  main: (mine: boolean) => ({
    backgroundColor: mine ? theme.colors.accent.bgAlt : undefined,
    gap: theme.space[2],
    padding: theme.space[3],
  }),
}))
