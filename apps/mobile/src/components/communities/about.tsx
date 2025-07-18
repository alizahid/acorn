import { Image } from 'expo-image'
import { ScrollView } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useFormatter, useTranslations } from 'use-intl'

import { Button } from '~/components/common/button'
import { Loading } from '~/components/common/loading'
import { Markdown } from '~/components/common/markdown'
import { RefreshControl } from '~/components/common/refresh-control'
import { Text } from '~/components/common/text'
import { TimeAgo } from '~/components/common/time'
import { View } from '~/components/common/view'
import { useImagePlaceholder } from '~/hooks/image'
import { type ListProps } from '~/hooks/list'
import { useFavorite } from '~/hooks/mutations/communities/favorite'
import { useJoin } from '~/hooks/mutations/communities/join'
import { useCommunity } from '~/hooks/queries/communities/community'

type Props = {
  listProps?: ListProps
  name: string
}

export function CommunityAbout({ listProps, name }: Props) {
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
      value: <TimeAgo>{community.createdAt}</TimeAgo>,
    },
  ] as const

  return (
    <ScrollView
      {...listProps}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl onRefresh={refetch} />}
    >
      {community.banner ? (
        <View mb="-4">
          <Image
            {...placeholder}
            accessibilityIgnoresInvertColors
            source={community.banner}
            style={styles.banner}
          />
        </View>
      ) : null}

      <View align="center" direction="row" gap="4" mt="4" mx="4">
        {community.image ? (
          <Image
            accessibilityIgnoresInvertColors
            source={community.image}
            style={styles.image}
          />
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

      {community.description ? (
        <Markdown
          recyclingKey={community.id}
          size="2"
          style={styles.description}
          variant="post"
        >
          {community.description}
        </Markdown>
      ) : null}

      <View direction="row" gap="4" mx="4">
        <Button
          color={community.subscribed ? 'red' : 'accent'}
          icon={{
            name: community.subscribed ? 'UserCircleMinus' : 'UserCirclePlus',
          }}
          justify="start"
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
          icon={{
            name: 'Star',
            weight: community.favorite ? 'fill' : 'regular',
          }}
          justify="start"
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

const stylesheet = createStyleSheet((theme) => ({
  banner: {
    aspectRatio: 1280 / 384,
    backgroundColor: theme.colors.gray.ui,
  },
  button: {
    flex: 1,
  },
  content: {
    gap: theme.space[4],
  },
  description: {
    marginHorizontal: theme.space[4],
  },
  image: {
    backgroundColor: theme.colors.gray.ui,
    borderCurve: 'continuous',
    borderRadius: theme.space[8],
    height: theme.space[8],
    width: theme.space[8],
  },
  info: {
    backgroundColor: theme.colors.accent.ui,
  },
}))
