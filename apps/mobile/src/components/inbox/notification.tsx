import { type SFSymbol } from 'expo-symbols'
import { StyleSheet } from 'react-native-unistyles'
import { useFormatter, useNow, useTranslations } from 'use-intl'

import { useLink } from '~/hooks/link'
import { useMarkAsRead } from '~/hooks/mutations/users/notifications'
import { mapColors } from '~/lib/styles'
import { usePreferences } from '~/stores/preferences'
import { oledTheme } from '~/styles/oled'
import { type ColorToken, colors } from '~/styles/tokens'
import { type Notification, type NotificationType } from '~/types/notification'

import { Html } from '../common/html'
import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { View } from '../common/view'

type Props = {
  notification: Notification
}

export function NotificationCard({ notification }: Props) {
  const t = useTranslations('component.inbox.notification')
  const f = useFormatter()
  const now = useNow({
    updateInterval: 1000 * 60,
  })

  const { themeOled } = usePreferences()

  styles.useVariants({
    color: tints[notification.type],
    oled: themeOled,
    unread: notification.new,
  })

  const { mark } = useMarkAsRead()

  const { handleLink } = useLink()

  const body = t(notification.type, {
    subreddit: notification.subreddit,
    user: notification.author,
  })

  return (
    <Pressable
      accessibilityLabel={body}
      align="center"
      direction="row"
      gap="4"
      onPress={() => {
        handleLink(notification.context)

        if (notification.new) {
          mark({
            id: notification.id,
            type: 'notification',
          })
        }
      }}
      p="4"
      style={styles.main}
    >
      <Icon
        name={icons[notification.type]}
        uniProps={(theme) => ({
          tintColor:
            theme.colors[notification.new ? tints[notification.type] : 'gray']
              .accent,
        })}
      />

      <View flexShrink={1} gap="2">
        <Text
          highContrast={notification.new}
          weight={notification.new ? 'medium' : undefined}
        >
          {body}
        </Text>

        <Html size="2">{notification.body}</Html>

        <View direction="row" gap="4">
          <Text highContrast={false} size="2">
            {f.relativeTime(notification.createdAt, now)}
          </Text>

          <Text highContrast={false} size="2">
            {notification.subreddit}
          </Text>
        </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create((theme) => ({
  main: {
    backgroundColor: theme.colors.gray.bgAltAlpha,
    compoundVariants: colors.map((token) => ({
      color: token,
      styles: {
        backgroundColor: theme.colors[token].uiAlpha,
      },
      unread: true,
    })),
    variants: {
      color: mapColors(() => ({})),
      oled: {
        true: {
          backgroundColor: oledTheme[theme.variant].bgAlpha,
        },
      },
      unread: {
        true: {},
      },
    },
  },
}))

const icons = {
  comment_reply: 'bubble.left',
  post_reply: 'arrowshape.turn.up.backward',
  username_mention: 'person',
} as const satisfies Record<NotificationType, SFSymbol>

const tints = {
  comment_reply: 'plum',
  post_reply: 'jade',
  username_mention: 'ruby',
} as const satisfies Record<NotificationType, ColorToken>
