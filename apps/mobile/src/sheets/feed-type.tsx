import BottomSheet, { BottomSheetFlashList } from '@gorhom/bottom-sheet'
import { Image } from 'expo-image'
import { compact } from 'lodash'
import { useRef } from 'react'
import { createCallable } from 'react-call'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { View } from '~/components/common/view'
import { useCommunities } from '~/hooks/queries/communities/communities'
import { useFeeds } from '~/hooks/queries/feeds/feeds'
import { listProps } from '~/lib/common'
import { removePrefix } from '~/lib/reddit'
import { FeedTypeColors, FeedTypeIcons } from '~/lib/sort'
import { FeedType } from '~/types/sort'

import { Spinner } from '../components/common/spinner'
import { SheetBackDrop } from '../components/sheets/back-drop'
import { SheetHeader } from '../components/sheets/header'
import { SheetItem } from '../components/sheets/item'

export type FeedTypeSheetProps = {
  community?: string
  feed?: string
  type?: FeedType
  user?: string
}

export type FeedTypeSheetReturn = FeedTypeSheetProps

export const FeedTypeSheet = createCallable<
  FeedTypeSheetProps,
  FeedTypeSheetReturn
>(function Component({ call, community, feed, type, user }) {
  const t = useTranslations('component.common.type')

  const { styles, theme } = useStyles(stylesheet)

  const sheet = useRef<BottomSheet>(null)

  const { feeds, isLoading: loadingFeeds } = useFeeds()
  const { communities, isLoading: loadingCommunities, users } = useCommunities()

  const data = compact([
    {
      key: 'type-title',
      title: t('type.title'),
      type: 'header' as const,
    },
    ...FeedType.map((item) => ({
      item,
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
      item,
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
        item,
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
        item,
        key: item.id,
        type: 'user' as const,
      })),
    users.length === 0 && {
      key: 'user-empty',
      type: 'empty' as const,
    },
  ])

  const sticky = data
    .map((item, index) => (item.type === 'header' ? index : null))
    .filter((item) => item !== null) as unknown as Array<number>

  return (
    <BottomSheet
      backdropComponent={SheetBackDrop}
      backgroundStyle={styles.background}
      enablePanDownToClose
      handleComponent={null}
      maxDynamicContentSize={styles.maxHeight.height}
      ref={sheet}
      style={styles.main}
    >
      <BottomSheetFlashList
        {...listProps}
        contentContainerStyle={styles.content}
        data={data}
        estimatedItemSize={48}
        getItemType={(item) => item.type}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => {
          if (item.type === 'separator') {
            return <View height="4" />
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
            return <SheetHeader title={item.title} />
          }

          if (item.type === 'type') {
            return (
              <SheetItem
                icon={{
                  color: theme.colors[FeedTypeColors[item.item]].a9,
                  name: FeedTypeIcons[item.item],
                }}
                label={t(`type.${item.item}`)}
                onPress={() => {
                  sheet.current?.close()

                  call.end({
                    type: item.item,
                  })
                }}
                selected={!feed && !community && item.item === type}
              />
            )
          }

          return (
            <SheetItem
              label={item.item.name}
              left={<Image source={item.item.image} style={styles.image} />}
              onPress={() => {
                sheet.current?.close()

                call.end({
                  [item.type]:
                    item.type === 'feed'
                      ? item.item.id
                      : item.type === 'user'
                        ? removePrefix(item.item.name)
                        : item.item.name,
                })
              }}
              right={
                'favorite' in item && item.favorite ? (
                  <Icon
                    color={theme.colors.amber.a9}
                    name="Star"
                    weight="fill"
                  />
                ) : null
              }
              selected={
                item.type === 'feed'
                  ? item.item.id === feed
                  : item.type === 'community'
                    ? item.item.name === community
                    : item.item.name === user
              }
            />
          )
        }}
        stickyHeaderIndices={sticky}
      />
    </BottomSheet>
  )
}, 250)

const stylesheet = createStyleSheet((theme, runtime) => ({
  background: {
    backgroundColor: theme.colors.gray[1],
    borderRadius: 0,
  },
  content: {
    paddingBottom: runtime.insets.bottom,
  },
  empty: {
    marginHorizontal: 'auto',
    marginVertical: theme.space[4],
  },
  header: {
    alignItems: 'flex-start',
    paddingHorizontal: theme.space[3],
  },
  image: {
    backgroundColor: theme.colors.gray.a3,
    borderCurve: 'continuous',
    borderRadius: theme.typography[3].lineHeight,
    height: theme.typography[3].lineHeight,
    width: theme.typography[3].lineHeight,
  },
  main: {
    borderCurve: 'continuous',
    borderTopLeftRadius: theme.radius[5],
    borderTopRightRadius: theme.radius[5],
    overflow: 'hidden',
  },
  maxHeight: {
    height: runtime.screen.height * 0.8,
  },
}))
