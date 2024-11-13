import BottomSheet, { BottomSheetSectionList } from '@gorhom/bottom-sheet'
import { Image } from 'expo-image'
import { useRef } from 'react'
import { createCallable } from 'react-call'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { useCommunities } from '~/hooks/queries/communities/communities'
import { useFeeds } from '~/hooks/queries/feeds/feeds'
import { listProps } from '~/lib/common'
import { removePrefix } from '~/lib/reddit'
import { FeedTypeColors, FeedTypeIcons } from '~/lib/sort'
import { type Community } from '~/types/community'
import { type Feed } from '~/types/feed'
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

type Item = FeedType | Feed | Community

type Section = {
  loading?: boolean
  title: string
  type: 'type' | 'feed' | 'community' | 'user'
}

export const FeedTypeSheet = createCallable<
  FeedTypeSheetProps,
  FeedTypeSheetReturn
>(function Component({ call, community, feed, type }) {
  const t = useTranslations('component.common.type')

  const { styles, theme } = useStyles(stylesheet)

  const sheet = useRef<BottomSheet>(null)

  const { feeds, isLoading: loadingFeeds } = useFeeds()
  const { communities, isLoading: loadingCommunities, users } = useCommunities()

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
      <BottomSheetSectionList<Item, Section>
        {...listProps}
        contentContainerStyle={styles.content}
        renderItem={({ item, section }) => {
          if (typeof item === 'string') {
            return (
              <SheetItem
                icon={{
                  color: theme.colors[FeedTypeColors[item]].a9,
                  name: FeedTypeIcons[item],
                }}
                key={item}
                label={t(`type.${item}`)}
                onPress={() => {
                  sheet.current?.close()

                  call.end({
                    type: item,
                  })
                }}
                selected={!feed && !community && item === type}
              />
            )
          }

          return (
            <SheetItem
              key={item.id}
              label={item.name}
              left={<Image source={item.image} style={styles.image} />}
              onPress={() => {
                sheet.current?.close()

                call.end({
                  [section.type]:
                    section.type === 'feed'
                      ? item.id
                      : section.type === 'user'
                        ? removePrefix(item.name)
                        : item.name,
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
              selected={item.name === community}
            />
          )
        }}
        renderSectionFooter={({ section }) => {
          if (section.loading) {
            return <Spinner m="4" />
          }

          if (section.data.length === 0) {
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

          return null
        }}
        renderSectionHeader={({ section }) => (
          <SheetHeader style={styles.header} title={section.title} />
        )}
        sections={[
          {
            data: FeedType,
            title: t('type.title'),
            type: 'type',
          },
          {
            data: feeds,
            loading: loadingFeeds,
            title: t('feeds.title'),
            type: 'feed',
          },
          {
            data: communities.filter((item) => typeof item !== 'string'),
            loading: loadingCommunities,
            title: t('communities.title'),
            type: 'community',
          },
          {
            data: users.filter((item) => typeof item !== 'string'),
            loading: loadingCommunities,
            title: t('users.title'),
            type: 'user',
          },
        ]}
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
