import { Image } from 'expo-image'
import { View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { StyleSheet } from 'react-native-unistyles'
import { useFormatter, useTranslations } from 'use-intl'

import { Button } from '~/components/common/button'
import { Loading } from '~/components/common/loading'
import { RefreshControl } from '~/components/common/refresh-control'
import { Text } from '~/components/common/text'
import { TimeAgo } from '~/components/common/time'
import { useImagePlaceholder } from '~/hooks/image'
import { useFavorite } from '~/hooks/mutations/communities/favorite'
import { useJoin } from '~/hooks/mutations/communities/join'
import { useCommunity } from '~/hooks/queries/communities/community'

import { Html } from '../common/html'

type Props = {
  name: string
}

export function CommunityAbout({ name }: Props) {
  const t = useTranslations('component.communities.about')
  const f = useFormatter()

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
      value: <TimeAgo date={community.createdAt} />,
    },
  ] as const

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="always"
      refreshControl={<RefreshControl onRefresh={refetch} />}
    >
      {community.banner ? (
        <Image
          {...placeholder}
          accessibilityIgnoresInvertColors
          source={community.banner}
          style={styles.banner}
        />
      ) : null}

      <View style={styles.header}>
        {community.image ? (
          <Image
            accessibilityIgnoresInvertColors
            source={community.image}
            style={styles.image}
          />
        ) : null}

        <View style={styles.name}>
          <Text size="6" weight="bold">
            r/{community.name}
          </Text>

          {community.title ? (
            <Text size="4" weight="medium">
              {community.title}
            </Text>
          ) : null}
        </View>
      </View>

      <View style={styles.info}>
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

      {community.description ? (
        <View style={styles.description}>
          <Html type="about">{community.description}</Html>
        </View>
      ) : null}

      <View style={styles.footer}>
        <Button
          color={community.subscribed ? 'red' : 'accent'}
          icon={
            community.subscribed
              ? 'person.crop.circle.badge.minus'
              : 'person.crop.circle.badge.plus'
          }
          label={t(community.subscribed ? 'leave' : 'join')}
          onPress={() => {
            join({
              action: community.subscribed ? 'leave' : 'join',
              id: community.id,
              name: community.name,
            })
          }}
          style={styles.button}
        />

        <Button
          color={community.favorite ? 'amber' : 'gray'}
          icon={community.favorite ? 'star.fill' : 'star'}
          label={t(community.favorite ? 'unfavorite' : 'favorite')}
          onPress={() => {
            favorite({
              favorite: !community.favorite,
              name: community.name,
            })
          }}
          style={styles.button}
        />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create((theme) => ({
  banner: {
    aspectRatio: 1280 / 384,
    backgroundColor: theme.colors.gray.ui,
    marginBottom: -theme.space[4],
  },
  button: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  content: {
    gap: theme.space[4],
  },
  description: {
    marginHorizontal: theme.space[4],
  },
  footer: {
    flexDirection: 'row',
    gap: theme.space[4],
    marginHorizontal: theme.space[4],
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.space[4],
    marginHorizontal: theme.space[5],
    marginTop: theme.space[4],
  },
  image: {
    backgroundColor: theme.colors.gray.ui,
    borderCurve: 'continuous',
    borderRadius: theme.space[8],
    height: theme.space[8],
    width: theme.space[8],
  },
  info: {
    alignItems: 'center',
    backgroundColor: theme.colors.accent.ui,
    flexDirection: 'row',
    gap: theme.space[6],
    justifyContent: 'center',
    padding: theme.space[4],
  },
  item: {
    gap: theme.space[1],
  },
  name: {
    flex: 1,
    gap: theme.space[2],
  },
}))
