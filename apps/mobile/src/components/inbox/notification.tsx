import { type SFSymbol } from 'expo-symbols'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useFormatter, useNow, useTranslations } from 'use-intl'

import { useLink } from '~/hooks/link'
import { useMarkAsRead } from '~/hooks/mutations/users/notifications'
import { mapColors } from '~/lib/styles'
import { usePreferences } from '~/stores/preferences'
import { oledTheme } from '~/styles/oled'
import { type ColorToken, colors } from '~/styles/tokens'
import { type Notification, type NotificationType } from '~/types/notification'

import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { Markdown } from '../markdown'

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
      onPress={() => {
        handleLink(notification.context)

        if (notification.new) {
          mark({
            id: notification.id,
            type: 'notification',
          })
        }
      }}
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

      <View style={styles.content}>
        <Text
          highContrast={notification.new}
          weight={notification.new ? 'medium' : undefined}
        >
          {body}
        </Text>

        <Markdown>{notification.body}</Markdown>

        <View style={styles.meta}>
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
  content: {
    flexShrink: 1,
    gap: theme.space[2],
  },
  main: {
    alignItems: 'center',
    backgroundColor: theme.colors.gray.bgAltAlpha,
    compoundVariants: colors.map((token) => ({
      color: token,
      styles: {
        backgroundColor: theme.colors[token].uiAlpha,
      },
      unread: true,
    })),
    flexDirection: 'row',
    gap: theme.space[4],
    padding: theme.space[4],
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
  meta: {
    flexDirection: 'row',
    gap: theme.space[4],
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
