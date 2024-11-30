import { FlashList } from '@shopify/flash-list'
import { Image } from 'expo-image'
import { compact } from 'lodash'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { View } from '~/components/common/view'
import { type ListProps } from '~/hooks/list'
import { useCommunities } from '~/hooks/queries/communities/communities'
import { useFeeds } from '~/hooks/queries/feeds/feeds'
import { removePrefix } from '~/lib/reddit'
import { FeedTypeColors, FeedTypeIcons } from '~/lib/sort'
import { FeedType } from '~/types/sort'

import { Spinner } from '../common/spinner'
import { SheetHeader } from '../sheets/header'
import { SheetItem } from '../sheets/item'
import { type FeedTypeOptions } from './type-menu'

type Props = FeedTypeOptions & {
  listProps?: ListProps
  onChange: (data: FeedTypeOptions) => void
  onClose: () => void
}

export function HomeDrawer({
  community,
  feed,
  listProps,
  onChange,
  onClose,
  type,
  user,
}: Props) {
  const t = useTranslations('component.common.type')

  const { styles, theme } = useStyles(stylesheet)

  const { feeds, isLoading: loadingFeeds } = useFeeds()
  const { communities, isLoading: loadingCommunities, users } = useCommunities()

  const data = compact([
    {
      key: 'type-title',
      title: t('type.title'),
      type: 'header' as const,
    },
    ...FeedType.map((item) => ({
      data: item,
      key: item,
      type: 'type' as const,
    })),

    {
      key: 'feed-separator',
      type: 'separator' as const,
    },
    {
      key: 'feed',
      title: t('feeds.title'),
      type: 'header' as const,
    },
    loadingFeeds && {
      key: 'feed-spinner',
      type: 'spinner' as const,
    },
    ...feeds.map((item) => ({
      data: item,
      key: item.id,
      type: 'feed' as const,
    })),
    feeds.length === 0 && {
      key: 'feed-empty',
      type: 'empty' as const,
    },

    {
      key: 'community-separator',
      type: 'separator' as const,
    },
    {
      key: 'community',
      title: t('communities.title'),
      type: 'header' as const,
    },
    loadingCommunities && {
      key: 'community-spinner',
      type: 'spinner' as const,
    },
    ...communities
      .filter((item) => typeof item !== 'string')
      .map((item) => ({
        data: item,
        key: item.id,
        type: 'community' as const,
      })),
    communities.length === 0 && {
      key: 'community-empty',
      type: 'empty' as const,
    },

    {
      key: 'user-separator',
      type: 'separator' as const,
    },
    {
      key: 'user',
      title: t('users.title'),
      type: 'header' as const,
    },
    loadingCommunities && {
      key: 'user-spinner',
      type: 'spinner' as const,
    },
    ...users
      .filter((item) => typeof item !== 'string')
      .map((item) => ({
        data: item,
        key: item.id,
        type: 'user' as const,
      })),
    users.length === 0 && {
      key: 'user-empty',
      type: 'empty' as const,
    },
  ])

  return (
    <FlashList
      {...listProps}
      data={data}
      estimatedItemSize={48}
      getItemType={(item) => item.type}
      keyExtractor={(item) => item.key}
      renderItem={({ item }) => {
        if (item.type === 'separator') {
          return <View height="8" />
        }

        if (item.type === 'empty') {
          return (
            <Icon
              color={theme.colors.accent.a9}
              name="SmileySad"
              size={theme.space[8]}
              style={styles.empty}
              weight="fill"
            />
          )
        }

        if (item.type === 'spinner') {
          return <Spinner m="4" />
        }

        if (item.type === 'header') {
          return <SheetHeader style={styles.header} title={item.title} />
        }

        if (item.type === 'type') {
          return (
            <SheetItem
              icon={{
                color: theme.colors[FeedTypeColors[item.data]].a9,
                name: FeedTypeIcons[item.data],
              }}
              label={t(`type.${item.data}`)}
              onPress={() => {
                onClose()

                onChange({
                  type: item.data,
                })
              }}
              selected={!feed && !community && item.data === type}
            />
          )
        }

        return (
          <SheetItem
            label={item.data.name}
            left={<Image source={item.data.image} style={styles.image} />}
            onPress={() => {
              onClose()

              onChange({
                [item.type]:
                  item.type === 'feed'
                    ? item.data.id
                    : item.type === 'user'
                      ? removePrefix(item.data.name)
                      : item.data.name,
              })
            }}
            right={
              'favorite' in item.data && item.data.favorite ? (
                <Icon
                  color={theme.colors.amber.a9}
                  name="Star"
                  size={theme.space[4]}
                  weight="fill"
                />
              ) : null
            }
            selected={
              item.type === 'feed'
                ? item.data.id === feed
                : item.type === 'community'
                  ? item.data.name === community
                  : item.data.name === user
            }
          />
        )
      }}
    />
  )
}

const stylesheet = createStyleSheet((theme) => ({
  empty: {
    marginHorizontal: 'auto',
    marginVertical: theme.space[4],
  },
  header: {
    backgroundColor: theme.colors.gray[2],
  },
  image: {
    backgroundColor: theme.colors.gray.a3,
    borderCurve: 'continuous',
    borderRadius: theme.typography[3].lineHeight,
    height: theme.typography[3].lineHeight,
    width: theme.typography[3].lineHeight,
  },
}))
