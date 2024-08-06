import { View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useFormatter, useTranslations } from 'use-intl'

import { Text } from '~/components/common/text'
import { withoutAgo } from '~/lib/intl'
import { type Profile } from '~/types/user'

type Props = {
  profile?: Profile
}

export function ProfileCard({ profile }: Props) {
  const t = useTranslations('component.users.profile')
  const f = useFormatter()

  const { styles } = useStyles(stylesheet)

  const items = [
    {
      key: 'karma',
      value: f.number(profile?.karma.total ?? 0, {
        notation: 'compact',
      }),
    },
    {
      key: 'post',
      value: f.number(profile?.karma.post ?? 0, {
        notation: 'compact',
      }),
    },
    {
      key: 'comment',
      value: f.number(profile?.karma.comment ?? 0, {
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
  )
}

const stylesheet = createStyleSheet((theme) => ({
  badge: {
    gap: theme.space[1],
  },
  main: {
    backgroundColor: theme.colors.accent.a2,
    flexDirection: 'row',
    gap: theme.space[6],
    justifyContent: 'center',
    padding: theme.space[4],
  },
}))
