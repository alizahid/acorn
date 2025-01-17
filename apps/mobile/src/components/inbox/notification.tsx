import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useFormatter, useNow, useTranslations } from 'use-intl'

import { useLink } from '~/hooks/link'
import { useMarkAsRead } from '~/hooks/mutations/users/notifications'
import { type ColorToken } from '~/styles/tokens'
import { type InboxNotification, type NotificationType } from '~/types/inbox'

import { Icon, type IconName } from '../common/icon'
import { Markdown } from '../common/markdown'
import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { View } from '../common/view'

type Props = {
  notification: InboxNotification
}

export function NotificationCard({ notification }: Props) {
  const t = useTranslations('component.inbox.notification')
  const f = useFormatter()
  const now = useNow({
    updateInterval: 1_000 * 60,
  })

  const { styles, theme } = useStyles(stylesheet)

  const { mark } = useMarkAsRead()

  const { handleLink } = useLink()

  return (
    <Pressable
      align="center"
      direction="row"
      gap="4"
      onPress={() => {
        void handleLink(notification.context)

        if (notification.new) {
          mark({
            id: notification.id,
            type: 'notification',
          })
        }
      }}
      p="4"
      style={styles.main(colors[notification.type], notification.new)}
    >
      <Icon
        color={
          theme.colors[notification.new ? colors[notification.type] : 'gray']
            .accent
        }
        name={icons[notification.type]}
        weight={notification.new ? 'fill' : 'bold'}
      />

      <View flexShrink={1} gap="2">
        <Text
          highContrast={notification.new}
          weight={notification.new ? 'medium' : undefined}
        >
          {t(notification.type, {
            subreddit: notification.subreddit,
            user: notification.author,
          })}
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

const stylesheet = createStyleSheet((theme) => ({
  main: (color: ColorToken, unread: boolean) => ({
    backgroundColor: unread ? theme.colors[color].ui : theme.colors.gray.bgAlt,
  }),
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
