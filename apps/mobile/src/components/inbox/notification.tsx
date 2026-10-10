import { type enums, type Notification } from '@acorn/reddit'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useFormatter, useNow } from 'use-intl'

import { useLink } from '~/hooks/link'
import { useMarkAsRead } from '~/hooks/mutations/users/notifications'
import { mapColors } from '~/lib/styles'
import { type ColorToken, colors } from '~/styles/tokens'

import { Icon, type IconName } from '../common/icon'
import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { Markdown } from '../markdown'

type Props = {
  notification: Notification
}

export function NotificationCard({ notification }: Props) {
  const f = useFormatter()
  const now = useNow({
    updateInterval: 1000 * 60,
  })

  const kind = (notification.type && kinds[notification.type]) ?? 'other'

  styles.useVariants({
    color: tints[kind],
    unread: notification.new,
  })

  const { mark } = useMarkAsRead()

  const { handleLink } = useLink()

  return (
    <Pressable
      accessibilityLabel={notification.title}
      onPress={() => {
        handleLink(notification.context)

        if (notification.new) {
          mark(notification)
        }
      }}
      style={styles.main}
    >
      <Icon
        name={icons[kind]}
        uniProps={(theme) => ({
          color: theme.colors[notification.new ? tints[kind] : 'gray'].accent,
        })}
      />

      <View style={styles.content}>
        <Text
          highContrast={notification.new}
          weight={notification.new ? 'medium' : undefined}
        >
          {notification.title}
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

type Kind = 'comment_reply' | 'post_reply' | 'username_mention' | 'other'

const kinds: Partial<Record<enums.MailroomMessageType, Kind>> = {
  COMMENT_REPLY: 'comment_reply',
  COMMENT_SUBSEQUENT_REPLY: 'comment_reply',
  POST_REPLY: 'post_reply',
  USERNAME_MENTION: 'username_mention',
}

const icons = {
  comment_reply: 'chat-centered',
  other: 'bell',
  post_reply: 'arrow-bend-up-left-bold',
  username_mention: 'user',
} as const satisfies Record<Kind, IconName>

const tints = {
  comment_reply: 'plum',
  other: 'gray',
  post_reply: 'jade',
  username_mention: 'ruby',
} as const satisfies Record<Kind, ColorToken>
