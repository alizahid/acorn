import { useRouter } from 'expo-router'
import { StyleSheet } from 'react-native-unistyles'
import { useFormatter, useNow } from 'use-intl'

import { useMarkAsRead } from '~/hooks/mutations/users/notifications'
import { usePreferences } from '~/stores/preferences'
import { oledTheme } from '~/styles/oled'
import { space } from '~/styles/tokens'
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

  styles.useVariants({
    oled: themeOled,
    unread: message.new,
  })

  const { mark } = useMarkAsRead()

  return (
    <Pressable
      accessibilityLabel={message.subject}
      align="center"
      direction="row"
      gap="4"
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
      style={styles.main}
    >
      <View flex={1} gap="2">
        <Text>{message.subject}</Text>

        <View direction="row" gap="4">
          <Pressable
            accessibilityLabel={message.author}
            hitSlop={space[4]}
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
        name="chevron.right"
        uniProps={(theme) => ({
          color: theme.colors.gray.accent,
          size: theme.space[4],
        })}
      />
    </Pressable>
  )
}

const styles = StyleSheet.create((theme) => ({
  body: {
    marginVertical: theme.space[4],
  },
  main: {
    backgroundColor: theme.colors.gray.bgAltAlpha,
    variants: {
      oled: {
        true: {
          backgroundColor: oledTheme[theme.variant].bgAlpha,
        },
      },
      unread: {
        true: {
          backgroundColor: theme.colors.accent.uiAlpha,
        },
      },
    },
  },
}))
