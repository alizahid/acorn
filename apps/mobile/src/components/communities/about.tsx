import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useFormatter, useTranslations } from 'use-intl'

import { Text } from '~/components/common/text'
import { useJoin } from '~/hooks/mutations/communities/join'
import { withoutAgo } from '~/lib/intl'
import { type Community } from '~/types/community'

import { Button } from '../common/button'
import { View } from '../common/view'

type Props = {
  community: Community
}

export function CommunityAboutCard({ community }: Props) {
  const t = useTranslations('component.communities.about')
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
    <View
      align="center"
      direction="row"
      gap="6"
      justify="between"
      p="4"
      style={styles.main}
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
  main: {
    backgroundColor: theme.colors.accent.a3,
  },
}))
