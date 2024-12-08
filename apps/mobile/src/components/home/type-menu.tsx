import { Image } from 'expo-image'
import { useMemo } from 'react'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { useCommunities } from '~/hooks/queries/communities/communities'
import { useFeeds } from '~/hooks/queries/feeds/feeds'
import { removePrefix } from '~/lib/reddit'
import { FeedTypeColors, FeedTypeIcons } from '~/lib/sort'
import { type FeedType } from '~/types/sort'

import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'
import { Text } from '../common/text'

export type FeedTypeOptions = {
  community?: string
  feed?: string
  type?: FeedType
  user?: string
}

type Props = {
  data: FeedTypeOptions
  onPress: () => void
}

export function FeedTypeMenu({ data, onPress }: Props) {
  const t = useTranslations('component.common.type.type')

  const { styles, theme } = useStyles(stylesheet)

  const { feeds } = useFeeds()
  const { communities, users } = useCommunities()

  const selected = useMemo(() => {
    if (data.user) {
      return users
        .filter((item) => typeof item !== 'string')
        .find((item) => removePrefix(item.name) === data.user)
    }

    if (data.community) {
      return communities
        .filter((item) => typeof item !== 'string')
        .find((item) => item.name === data.community)
    }

    if (data.feed) {
      return feeds.find((item) => item.id === data.feed)
    }

    if (data.type) {
      return {
        id: data.type,
        image: null,
        name: t(data.type),
      }
    }
  }, [
    communities,
    data.community,
    data.feed,
    data.type,
    data.user,
    feeds,
    t,
    users,
  ])

  return (
    <Pressable
      align="center"
      direction="row"
      gap="2"
      height="8"
      onPress={onPress}
      px="3"
    >
      {selected?.image ? (
        <Image source={selected.image} style={styles.image} />
      ) : (
        <Icon
          color={
            data.type
              ? theme.colors[FeedTypeColors[data.type]].a9
              : theme.colors.gray.a9
          }
          name={data.type ? FeedTypeIcons[data.type] : 'Question'}
          size={theme.space[5]}
          weight="duotone"
        />
      )}

      {selected?.name ? <Text weight="medium">{selected.name}</Text> : null}

      <Icon
        color={theme.colors.gray.a11}
        name="CaretDown"
        size={theme.space[4]}
        weight="bold"
      />
    </Pressable>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  image: {
    borderCurve: 'continuous',
    borderRadius: theme.space[5],
    height: theme.space[5],
    width: theme.space[5],
  },
}))
