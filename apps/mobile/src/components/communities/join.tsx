import { View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useFormatter, useTranslations } from 'use-intl'

import { Text } from '~/components/common/text'
import { useJoin } from '~/hooks/mutations/communities/join'
import { withoutAgo } from '~/lib/intl'
import { type Community } from '~/types/community'

import { Button } from '../common/button'

type Props = {
  community: Community
}

export function CommunityJoinCard({ community }: Props) {
  const t = useTranslations('component.communities.join')
  const f = useFormatter()

  const { styles } = useStyles(stylesheet)

  const { isPending, join } = useJoin()

  const items = [
    {
      key: 'subscribers',
      value: f.number(community.subscribers, {
        notation: 'compact',
      }),
    },
    {
      key: 'age',
      value: withoutAgo(
        f.relativeTime(community.createdAt, {
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
        color={community.subscribed ? 'red' : 'accent'}
        label={t(community.subscribed ? 'leave' : 'join')}
        loading={isPending}
        onPress={() => {
          join({
            action: community.subscribed ? 'leave' : 'join',
            id: community.id,
            name: community.name,
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
