import { StyleSheet } from 'react-native-unistyles'
import { useFormatter, useNow, useTranslations } from 'use-intl'

import { useLink } from '~/hooks/link'
import { useMarkAsRead } from '~/hooks/mutations/users/notifications'
import { usePreferences } from '~/stores/preferences'
import { oledTheme } from '~/styles/oled'
import { type ColorToken, ColorTokens } from '~/styles/tokens'
import { type Notification, type NotificationType } from '~/types/inbox'

import { Icon, type IconName } from '../common/icon'
import { Markdown } from '../common/markdown'
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
    color: colors[notification.type],
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
      align="center"
      direction="row"
      gap="4"
      label={body}
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
          color:
            theme.colors[notification.new ? colors[notification.type] : 'gray']
              .accent,
        })}
        weight={notification.new ? 'fill' : 'bold'}
      />

      <View flexShrink={1} gap="2">
        <Text
          highContrast={notification.new}
          weight={notification.new ? 'medium' : undefined}
        >
          {body}
        </Text>

        <Markdown recyclingKey={notification.id} size="2" variant="comment">
          {notification.body}
        </Markdown>

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
    compoundVariants: ColorTokens.map((token) => ({
      color: token,
      styles: {
        backgroundColor: theme.colors[token].uiAlpha,
      },
      unread: true,
    })),
    variants: {
      color: Object.fromEntries(ColorTokens.map((token) => [token, {}])),
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

const icons: Record<NotificationType, IconName> = {
  comment_reply: 'ChatCircle',
  post_reply: 'ArrowBendUpLeft',
  username_mention: 'User',
}

const colors: Record<NotificationType, ColorToken> = {
  comment_reply: 'plum',
  post_reply: 'jade',
  username_mention: 'ruby',
}
