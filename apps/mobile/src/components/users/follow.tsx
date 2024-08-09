import { View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useFormatter, useTranslations } from 'use-intl'

import { Text } from '~/components/common/text'
import { useFollow } from '~/hooks/mutations/users/follow'
import { withoutAgo } from '~/lib/intl'
import { type Profile } from '~/types/user'

import { Button } from '../common/button'

type Props = {
  profile?: Profile
}

export function UserFollowCard({ profile }: Props) {
  const t = useTranslations('component.users.follow')
  const f = useFormatter()

  const { styles } = useStyles(stylesheet)

  const { follow, isPending } = useFollow()

  const items = [
    {
      key: 'karma',
      value: f.number(profile?.karma.total ?? 0, {
        notation: 'compact',
      }),
    },
    {
      key: 'age',
      value: withoutAgo(
        f.relativeTime(profile?.createdAt ?? new Date(), {
          style: 'narrow',
        }),
      ),
    },
  ] as const

  return (
    <View style={styles.main}>
      <View style={styles.info}>
        {items.map((item) => (
          <View key={item.key} style={styles.badge}>
            <Text align="center" highContrast={false} size="1" weight="medium">
              {t(item.key)}
            </Text>

            <Text align="center" tabular weight="bold">
              {item.value}
            </Text>
          </View>
        ))}
      </View>

      <Button
        color={profile?.subscribed ? 'red' : 'accent'}
        label={t(profile?.subscribed ? 'unfollow' : 'follow')}
        loading={isPending}
        onPress={() => {
          if (!profile) {
            return
          }

          follow({
            action: profile.subscribed ? 'unfollow' : 'follow',
            id: profile.subreddit,
            name: profile.name,
          })
        }}
      />
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  badge: {
    gap: theme.space[1],
  },
  info: {
    flexDirection: 'row',
    gap: theme.space[6],
  },
  main: {
    alignItems: 'center',
    backgroundColor: theme.colors.accent.a3,
    flexDirection: 'row',
    gap: theme.space[6],
    justifyContent: 'space-between',
    padding: theme.space[4],
  },
}))
