import { type Profile } from '@acorn/reddit'
import { compact } from 'lodash'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useFormatter, useTranslations } from 'use-intl'

import { Text } from '~/components/common/text'

import { TimeAgo } from '../common/time'

type Props = {
  profile?: Profile
}

export function ProfileCard({ profile }: Props) {
  const t = useTranslations('component.users.profile')
  const f = useFormatter()

  const items = compact([
    {
      key: 'karma' as const,
      value: f.number(profile?.karma.total ?? 0, {
        notation: 'compact',
      }),
    },
    {
      key: 'post' as const,
      value: f.number(profile?.karma.post ?? 0, {
        notation: 'compact',
      }),
    },
    {
      key: 'comment' as const,
      value: f.number(profile?.karma.comment ?? 0, {
        notation: 'compact',
      }),
    },
    profile?.createdAt && profile.createdAt.getTime() !== 0
      ? {
          key: 'age' as const,
          value: <TimeAgo date={profile.createdAt} />,
        }
      : null,
  ])

  return (
    <View style={styles.main}>
      {items.map((item) => (
        <View key={item.key} style={styles.item}>
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

const styles = StyleSheet.create((theme) => ({
  item: {
    gap: theme.space[1],
  },
  main: {
    alignItems: 'center',
    backgroundColor: theme.colors.accent.ui,
    flexDirection: 'row',
    gap: theme.space[6],
    justifyContent: 'center',
    padding: theme.space[4],
  },
}))
