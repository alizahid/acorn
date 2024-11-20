import { Image } from 'expo-image'
import { ScrollView } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useFormatter, useTranslations } from 'use-intl'

import { useImagePlaceholder } from '~/hooks/image'
import { useFavorite } from '~/hooks/mutations/communities/favorite'
import { useJoin } from '~/hooks/mutations/communities/join'
import { useCommunity } from '~/hooks/queries/communities/community'
import { withoutAgo } from '~/lib/intl'

import { Loading } from '../../common/loading'
import { RefreshControl } from '../../common/refresh-control'
import { Text } from '../../common/text'
import { View } from '../../common/view'
import { Button } from './button'

type Props = {
  name: string
}

export function CommunityAbout({ name }: Props) {
  const t = useTranslations('component.communities.about')
  const f = useFormatter()

  const { styles } = useStyles(stylesheet)

  const { community, refetch } = useCommunity(name)

  const { join } = useJoin()
  const { favorite } = useFavorite()

  const placeholder = useImagePlaceholder()

  if (!community) {
    return <Loading />
  }

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
    <ScrollView refreshControl={<RefreshControl onRefresh={refetch} />}>
      {community.banner ? (
        <Image
          {...placeholder}
          source={community.banner}
          style={styles.banner}
        />
      ) : null}

      <View direction="row" gap="4" p="4">
        {community.image ? (
          <Image source={community.image} style={styles.image} />
        ) : null}

        <View flex={1} gap="2">
          <Text size="6" weight="bold">
            r/{community.name}
          </Text>

          {community.title ? (
            <Text size="4" weight="medium">
              {community.title}
            </Text>
          ) : null}

          {community.description ? (
            <Text size="2">{community.description}</Text>
          ) : null}
        </View>
      </View>

      <View
        align="center"
        direction="row"
        gap="6"
        justify="center"
        p="4"
        style={styles.info}
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

      <View direction="row" gap="4" p="4">
        <Button
          color={community.subscribed ? 'red' : 'accent'}
          icon={community.subscribed ? 'UserCircleMinus' : 'UserCirclePlus'}
          label={t(community.subscribed ? 'leave' : 'join')}
          onPress={() => {
            join({
              action: community.subscribed ? 'leave' : 'join',
              id: community.id,
              name: community.name,
            })
          }}
        />

        <Button
          color={community.favorite ? 'amber' : 'gray'}
          icon="Star"
          label={t(community.favorite ? 'unfavorite' : 'favorite')}
          onPress={() => {
            favorite({
              favorite: !community.favorite,
              name: community.name,
            })
          }}
          weight={community.favorite ? 'fill' : 'regular'}
        />
      </View>
    </ScrollView>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  banner: {
    aspectRatio: 1280 / 384,
    backgroundColor: theme.colors.gray.a3,
  },
  image: {
    backgroundColor: theme.colors.gray.a3,
    borderCurve: 'continuous',
    borderRadius: theme.space[8],
    height: theme.space[8],
    width: theme.space[8],
  },
  info: {
    backgroundColor: theme.colors.accent.a3,
  },
}))
