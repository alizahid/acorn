import { useRouter } from 'expo-router'
import { last } from 'lodash'
import { StyleSheet } from 'react-native-unistyles'
import { useFormatter, useNow, useTranslations } from 'use-intl'

import { useMarkAsRead } from '~/hooks/mutations/users/notifications'
import { useAuth } from '~/stores/auth'
import { usePreferences } from '~/stores/preferences'
import { oledTheme } from '~/styles/oled'
import { space } from '~/styles/tokens'
import { type Message } from '~/types/message'

import { Html } from '../common/html'
import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { View } from '../common/view'

type Props = {
  message: Message
}

export function MessageCard({ message }: Props) {
  const router = useRouter()

  const { accountId } = useAuth()

  const { themeOled } = usePreferences()

  const a11y = useTranslations('a11y')
  const f = useFormatter()
  const now = useNow({
    updateInterval: 1000 * 60,
  })

  styles.useVariants({
    oled: themeOled,
    unread: message.new,
  })

  const { mark } = useMarkAsRead()

  const user = message.from === accountId ? message.to : message.from

  const body = (last(message.replies) ?? message).body

  return (
    <Pressable
      accessibilityLabel={a11y('viewThread')}
      align="center"
      direction="row"
      gap="4"
      onPress={() => {
        router.push({
          params: {
            id: message.id,
            user,
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
        <View direction="row" gap="4">
          <Pressable
            accessibilityHint={a11y('viewUser')}
            accessibilityLabel={user}
            hitSlop={space[4]}
            onPress={() => {
              router.push({
                params: {
                  name: user,
                },
                pathname: '/users/[name]',
              })
            }}
          >
            <Text color="accent" size="2" weight="medium">
              {user}
            </Text>
          </Pressable>

          <Text highContrast={false} size="2">
            {f.relativeTime(message.updatedAt, now)}
          </Text>
        </View>

        <Html size="2">{body}</Html>
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
