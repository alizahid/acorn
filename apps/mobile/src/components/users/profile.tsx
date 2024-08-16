import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useFormatter, useTranslations } from 'use-intl'

import { Text } from '~/components/common/text'
import { withoutAgo } from '~/lib/intl'
import { type Profile } from '~/types/user'

import { View } from '../common/view'

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
    <View
      align="center"
      direction="row"
      gap="6"
      justify="center"
      p="4"
      style={styles.main}
    >
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
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: {
    backgroundColor: theme.colors.accent.a3,
  },
}))
