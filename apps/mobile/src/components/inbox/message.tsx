import { useRouter } from 'expo-router'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useFormatter, useNow } from 'use-intl'

import { useMarkAsRead } from '~/hooks/mutations/users/notifications'
import { usePreferences } from '~/stores/preferences'
import { oledTheme } from '~/styles/oled'
import { type InboxMessage } from '~/types/inbox'

import { Markdown } from '../common/markdown'
import { Pressable } from '../common/pressable'
import { Text } from '../common/text'

type Props = {
  message: InboxMessage
}

export function MessageCard({ message }: Props) {
  const router = useRouter()

  const { themeOled } = usePreferences()

  const f = useFormatter()
  const now = useNow({
    updateInterval: 1_000 * 60,
  })

  const { styles, theme } = useStyles(stylesheet)

  const { mark } = useMarkAsRead()

  return (
    <Pressable
      delayed
      disabled={!message.new}
      onPress={() => {
        mark({
          id: message.id,
          type: 'message',
        })
      }}
      p="4"
      style={styles.main(message.new, themeOled)}
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
        {f.relativeTime(message.createdAt, now)}
      </Text>
    </Pressable>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  body: {
    marginVertical: theme.space[4],
  },
  main: (unread: boolean, oled: boolean) => ({
    backgroundColor: unread
      ? theme.colors.accent.uiAlpha
      : oled
        ? oledTheme[theme.name].bgAlpha
        : theme.colors.gray.bgAltAlpha,
  }),
}))
