import { type StyleProp, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useFormatter } from 'use-intl'

import { type Message } from '~/types/message'

import { Markdown } from '../common/markdown'
import { Text } from '../common/text'
import { View } from '../common/view'

type Props = {
  message: Message
  style?: StyleProp<ViewStyle>
  userId?: string
}

export function MessageCard({ message, style, userId }: Props) {
  const f = useFormatter()

  const { styles } = useStyles(stylesheet)

  const self = message.author === userId

  return (
    <View
      align={self ? 'end' : 'start'}
      gap="1"
      self={self ? 'end' : 'start'}
      style={style}
    >
      <View px="2" py="1" style={styles.content(self)}>
        <Markdown recyclingKey={message.id} variant="comment">
          {message.body}
        </Markdown>
      </View>

      <Text highContrast={false} size="1" tabular>
        {f.dateTime(message.createdAt, {
          timeStyle: 'short',
        })}
      </Text>
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  content: (self: boolean) => ({
    backgroundColor: self ? theme.colors.accent.ui : theme.colors.gray.ui,
    borderCurve: 'continuous',
    borderRadius: theme.space[2],
    maxWidth: '90%',
  }),
}))
