import { Image } from 'expo-image'
import { compact } from 'lodash'
import ActionSheet, {
  FlatList,
  type SheetDefinition,
  SheetManager,
  type SheetProps,
  useSheetPayload,
} from 'react-native-actions-sheet'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Spinner } from '~/components/common/spinner'
import { useFeeds } from '~/hooks/queries/feeds/feeds'
import { FeedTypeColors, FeedTypeIcons } from '~/lib/sort'
import { FeedType } from '~/types/sort'

import { SheetHeader } from './header'
import { SheetItem } from './item'

export type FeedTypeSheetPayload = {
  feed?: string
  type?: FeedType
}

export type FeedTypeSheetReturnValue = {
  feed?: string
  type?: FeedType
}

export type FeedTypeSheetDefinition = SheetDefinition<{
  payload: FeedTypeSheetPayload
  returnValue: FeedTypeSheetReturnValue
}>

export function FeedTypeSheet({ sheetId }: SheetProps<'feed-type'>) {
  const t = useTranslations('component.common.type')

  const { feed, type } = useSheetPayload<'feed-type'>()

  const { styles, theme } = useStyles(stylesheet)

  const { feeds, isLoading } = useFeeds()

  return (
    <ActionSheet
      containerStyle={styles.main}
      gestureEnabled
      id={sheetId}
      indicatorStyle={styles.indicator}
      initialRoute="sort"
      overlayColor={theme.colors.gray.a9}
    >
      <SheetHeader title={t('title')} />

      <FlatList
        contentContainerStyle={styles.content}
        data={compact([...FeedType, isLoading ? 'loading' : null, ...feeds])}
        renderItem={({ item }) => {
          if (item === 'loading') {
            return <Spinner />
          }

          if (typeof item === 'string') {
            return (
              <SheetItem
                icon={{
                  color: theme.colors[FeedTypeColors[item]].a9,
                  name: FeedTypeIcons[item],
                }}
                label={t(item)}
                onPress={() => {
                  void SheetManager.hide('feed-type', {
                    payload: {
                      type: item,
                    },
                  })
                }}
                selected={!feed && item === type}
              />
            )
          }

          return (
            <SheetItem
              key={item.id}
              label={item.name}
              left={<Image source={item.image} style={styles.image} />}
              onPress={() => {
                void SheetManager.hide('feed-type', {
                  payload: {
                    feed: item.id,
                  },
                })
              }}
              selected={item.id === feed}
            />
          )
        }}
        style={styles.list}
      />
    </ActionSheet>
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  content: {
    paddingBottom: runtime.insets.bottom,
  },
  image: {
    height: theme.typography[2].lineHeight,
    width: theme.typography[2].lineHeight,
  },
  indicator: {
    display: 'none',
  },
  list: {
    maxHeight: 300,
  },
  main: {
    backgroundColor: theme.colors.gray[1],
  },
}))
