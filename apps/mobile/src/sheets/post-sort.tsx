import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import { useEffect, useRef } from 'react'
import { createCallable } from 'react-call'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { TopIntervalItem } from '~/components/posts/interval'
import { SheetBackDrop } from '~/components/sheets/back-drop'
import { SortColors, SortIcons } from '~/lib/sort'
import {
  CommentSort,
  CommunityFeedSort,
  FeedSort,
  type PostSort,
  SearchSort,
  type SortType,
  TopInterval,
  UserFeedSort,
} from '~/types/sort'

import { SheetHeader } from '../components/sheets/header'
import { SheetItem } from '../components/sheets/item'

export type PostSortSheetProps = {
  interval?: TopInterval
  sort?: PostSort
  type: SortType
}

export type PostSortSheetReturn = {
  interval?: TopInterval
  sort: PostSort
}

export const PostSortSheet = createCallable<
  PostSortSheetProps,
  PostSortSheetReturn
>(function Component({ call, interval, sort, type }) {
  const t = useTranslations('component.common')

  const { styles, theme } = useStyles(stylesheet)

  const modalSort = useRef<BottomSheetModal>(null)
  const modalInterval = useRef<BottomSheetModal>(null)

  useEffect(() => {
    modalSort.current?.present()
  }, [])

  const items =
    type === 'comment'
      ? CommentSort
      : type === 'community'
        ? CommunityFeedSort
        : type === 'search'
          ? SearchSort
          : type === 'user'
            ? UserFeedSort
            : FeedSort

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        backdropComponent={SheetBackDrop}
        backgroundStyle={styles.background}
        enablePanDownToClose
        handleComponent={null}
        maxDynamicContentSize={styles.maxHeight.height}
        ref={modalSort}
        stackBehavior="push"
        style={styles.main}
      >
        <BottomSheetView style={styles.content}>
          <SheetHeader title={t('sort.title')} />

          {items.map((item) => (
            <SheetItem
              icon={{
                color: theme.colors[SortColors[item]].a9,
                name: SortIcons[item],
              }}
              key={item}
              label={t(`sort.${item}`)}
              navigate={item === 'top'}
              onPress={() => {
                if (item === 'top') {
                  modalInterval.current?.present()

                  return
                }

                modalSort.current?.close()

                call.end({
                  sort: item,
                })
              }}
              selected={item === sort}
            />
          ))}
        </BottomSheetView>
      </BottomSheetModal>

      <BottomSheetModal
        backdropComponent={SheetBackDrop}
        backgroundStyle={styles.background}
        enablePanDownToClose
        handleComponent={null}
        maxDynamicContentSize={styles.maxHeight.height}
        ref={modalInterval}
        stackBehavior="push"
        style={styles.main}
      >
        <BottomSheetView style={styles.content}>
          <SheetHeader title={t('interval.title')} />

          {TopInterval.map((item) => (
            <SheetItem
              key={item}
              label={t(`interval.${item}`)}
              left={<TopIntervalItem interval={item} />}
              onPress={() => {
                modalInterval.current?.close()
                modalSort.current?.close()

                call.end({
                  interval: item,
                  sort: 'top',
                })
              }}
              selected={item === interval}
            />
          ))}
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
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
