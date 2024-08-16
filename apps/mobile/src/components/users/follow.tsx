import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useFormatter, useTranslations } from 'use-intl'

import { Text } from '~/components/common/text'
import { useFollow } from '~/hooks/mutations/users/follow'
import { withoutAgo } from '~/lib/intl'
import { type Profile } from '~/types/user'

import { Button } from '../common/button'
import { View } from '../common/view'

type Props = {
  profile: Profile
}

export function UserFollowCard({ profile }: Props) {
  const t = useTranslations('component.users.follow')
  const f = useFormatter()

  const { styles } = useStyles(stylesheet)

  const { follow, isPending } = useFollow()

  const items = [
    {
      key: 'karma',
      value: f.number(profile.karma.total, {
        notation: 'compact',
      }),
    },
    {
      key: 'age',
      value: withoutAgo(
        f.relativeTime(profile.createdAt, {
          style: 'narrow',
        }),
      ),
    },
  ] as const

  return (
    <View gap="4" p="4" style={styles.main}>
      <Text weight="bold">{profile.name}</Text>

      <View align="center" direction="row" gap="6" justify="between">
        <View direction="row" gap="6">
          {items.map((item) => (
            <View gap="1" key={item.key}>
              <Text
                align="center"
                highContrast={false}
                size="1"
                weight="medium"
              >
                {t(item.key)}
              </Text>

              <Text align="center" tabular weight="bold">
                {item.value}
              </Text>
            </View>
          ))}
        </View>

        <Button
          color={profile.subscribed ? 'red' : 'accent'}
          label={t(profile.subscribed ? 'unfollow' : 'follow')}
          loading={isPending}
          onPress={() => {
            follow({
              action: profile.subscribed ? 'unfollow' : 'follow',
              id: profile.subreddit,
              name: profile.name,
            })
          }}
        />
      </View>
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: {
    backgroundColor: theme.colors.accent.a3,
  },
}))
