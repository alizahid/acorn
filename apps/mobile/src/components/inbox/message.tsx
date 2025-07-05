import { useRouter } from 'expo-router'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useFormatter, useNow } from 'use-intl'

import { useMarkAsRead } from '~/hooks/mutations/users/notifications'
import { usePreferences } from '~/stores/preferences'
import { oledTheme } from '~/styles/oled'
import { type InboxMessage } from '~/types/inbox'

import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { View } from '../common/view'

type Props = {
  message: InboxMessage
}

export function MessageCard({ message }: Props) {
  const router = useRouter()

  const { themeOled } = usePreferences()

  const f = useFormatter()
  const now = useNow({
    updateInterval: 1000 * 60,
  })

  const { styles, theme } = useStyles(stylesheet)

  const { mark } = useMarkAsRead()

  return (
    <Pressable
      align="center"
      direction="row"
      gap="4"
      label={message.subject}
      onPress={() => {
        router.push({
          params: {
            id: message.id,
            user: message.author,
          },
          pathname: '/messages/[id]',
        })

        if (message.new) {
          mark({
            id: message.id,
            type: 'message',
          })
        }
      }}
      p="4"
      style={styles.main(message.new, themeOled)}
    >
      <View flex={1} gap="2">
        <Text>{message.subject}</Text>

        <View direction="row" gap="4">
          <Pressable
            hitSlop={theme.space[4]}
            label={message.author}
            onPress={() => {
              router.push({
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

          <Text highContrast={false} size="2">
            {f.relativeTime(message.createdAt, now)}
          </Text>
        </View>
      </View>

      <Icon
        color={theme.colors.gray.accent}
        name="CaretRight"
        size={theme.space[4]}
      />
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
