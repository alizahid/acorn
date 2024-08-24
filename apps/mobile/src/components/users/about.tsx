import { type StyleProp, type ViewStyle } from 'react-native'
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
  style?: StyleProp<ViewStyle>
}

export function UserAboutCard({ profile, style }: Props) {
  const t = useTranslations('component.users.about')
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
    <View
      align="center"
      direction="row"
      gap="4"
      justify="between"
      p="4"
      style={[styles.main, style]}
    >
      <View direction="row" gap="6">
        {items.map((item) => (
          <View gap="1" key={item.key}>
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
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: {
    backgroundColor: theme.colors.accent.a3,
  },
}))
