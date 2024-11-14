import { Image } from 'expo-image'
import { useMemo } from 'react'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { useCommunities } from '~/hooks/queries/communities/communities'
import { useFeeds } from '~/hooks/queries/feeds/feeds'
import { removePrefix } from '~/lib/reddit'
import { FeedTypeColors, FeedTypeIcons } from '~/lib/sort'
import { type FeedType } from '~/types/sort'

import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'

export type FeedTypeOptions = {
  community?: string
  feed?: string
  type?: FeedType
  user?: string
}

type Props = FeedTypeOptions & {
  onPress: () => void
}

export function FeedTypeMenu({ community, feed, onPress, type, user }: Props) {
  const { styles, theme } = useStyles(stylesheet)

  const { feeds } = useFeeds()
  const { communities, users } = useCommunities()

  const image = useMemo(
    () =>
      user
        ? users
            .filter((item) => typeof item !== 'string')
            .find((item) => removePrefix(item.name) === user)?.image
        : community
          ? communities
              .filter((item) => typeof item !== 'string')
              .find((item) => item.name === community)?.image
          : feed
            ? feeds.find((item) => item.id === feed)?.image
            : undefined,
    [communities, community, feed, feeds, user, users],
  )

  return (
    <Pressable
      align="center"
      direction="row"
      gap="2"
      height="8"
      onPress={onPress}
      px="3"
    >
      {image ? (
        <Image source={image} style={styles.image} />
      ) : (
        <Icon
          color={
            type ? theme.colors[FeedTypeColors[type]].a9 : theme.colors.gray.a9
          }
          name={type ? FeedTypeIcons[type] : 'Question'}
          size={theme.space[5]}
          weight="duotone"
        />
      )}

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
