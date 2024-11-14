import { useRouter } from 'expo-router'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useFormatter } from 'use-intl'

import { useMarkAsRead } from '~/hooks/mutations/users/notifications'
import { type InboxMessage } from '~/types/inbox'

import { Markdown } from '../common/markdown'
import { Pressable } from '../common/pressable'
import { Text } from '../common/text'

type Props = {
  message: InboxMessage
}

export function MessageCard({ message }: Props) {
  const router = useRouter()

  const f = useFormatter()

  const { styles, theme } = useStyles(stylesheet)

  const { mark } = useMarkAsRead()

  return (
    <Pressable
      disabled={!message.new}
      onPress={() => {
        mark({
          id: message.id,
        })
      }}
      p="4"
      style={styles.main(message.new)}
    >
      <Pressable
        hitSlop={theme.space[4]}
        onPress={() => {
          router.navigate({
            params: {
              name: message.author,
            },
            pathname: '/users/[name]',
          })
        }}
      >
        <Text color="accent" size="2" weight="medium">
          {message.author}
        </Text>
      </Pressable>

      <Text weight="medium">{message.subject}</Text>

      <Markdown
        recyclingKey={message.id}
        size="2"
        style={styles.body}
        variant="comment"
      >
        {message.body}
      </Markdown>

      <Text highContrast={false} size="2">
        {f.relativeTime(message.createdAt)}
      </Text>
    </Pressable>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  body: {
    marginVertical: theme.space[4],
  },
  main: (unread: boolean) => ({
    backgroundColor: unread ? theme.colors.accent.a3 : theme.colors.gray.a2,
  }),
}))
