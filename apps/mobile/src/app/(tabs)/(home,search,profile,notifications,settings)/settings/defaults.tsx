import { create } from 'mutative'
import { useRef } from 'react'
import { View } from 'react-native'
import {
  NestedReorderableList,
  reorderItems,
  ScrollViewContainer,
} from 'react-native-reorderable-list'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { useShallow } from 'zustand/react/shallow'

import { Icon } from '~/components/common/icon'
import { ListItem } from '~/components/common/list/item'
import { Sheet } from '~/components/common/sheet'
import { Text } from '~/components/common/text'
import { CommunitiesList } from '~/components/communities/list'
import { DraggableItem } from '~/components/defaults/draggable-item'
import { useListProps } from '~/hooks/list'
import { FeedTypeColors, FeedTypeIcons } from '~/lib/sort'
import { useDefaults } from '~/stores/defaults'
import { space } from '~/styles/tokens'

export default function Screen() {
  const t = useTranslations('screen.settings.defaults')

  const { community, drawerSections, feed, feedType, searchTabs, update } =
    useDefaults(
      useShallow((state) => ({
        community: state.community,
        drawerSections: state.drawerSections,
        feed: state.feed,
        feedType: state.feedType,
        searchTabs: state.searchTabs,
        update: state.update,
      })),
    )

  const sheet = useRef<Sheet>(null)

  const listProps = useListProps({
    extraBottom: space[4],
    extraTop: space[4],
    flash: false,
  })

  return (
    <>
      <ScrollViewContainer
        {...listProps}
        contentContainerStyle={[
          listProps.contentContainerStyle,
          styles.content,
        ]}
      >
        <View>
          <Text mb="2" size="2" weight="medium">
            {t('feedType.title')}
          </Text>

          <ListItem
            icon={
              <Icon
                name={
                  community
                    ? 'users-four'
                    : feed
                      ? 'newspaper'
                      : FeedTypeIcons[feedType]
                }
                uniProps={(theme) => ({
                  color: community
                    ? undefined
                    : feed
                      ? undefined
                      : theme.colors[FeedTypeColors[feedType]].accent,
                })}
              />
            }
            label={community ?? feed ?? t(`feedType.${feedType}`)}
            onPress={() => {
              sheet.current?.present()
            }}
            style={styles.item}
          />
        </View>

        <View style={styles.section}>
          <Text mb="2" size="2" weight="medium">
            {t('searchTabs.title')}
          </Text>

          <NestedReorderableList
            data={searchTabs}
            keyExtractor={(item) => item.key}
            onReorder={(event) => {
              const next = reorderItems(searchTabs, event.from, event.to)

              update({
                searchTabs: next,
              })
            }}
            renderItem={({ index, item }) => (
              <DraggableItem
                label={t(`searchTabs.${item.key}`)}
                onChange={(value) => {
                  if (
                    !value &&
                    searchTabs.filter((tab) => tab.disabled).length >= 1
                  ) {
                    return
                  }

                  const next = create(searchTabs, (draft) => {
                    if (draft[index]) {
                      draft[index].disabled = !value
                    }
                  })

                  update({
                    searchTabs: next,
                  })
                }}
                style={styles.item}
                value={!item.disabled}
              />
            )}
            scrollEnabled={false}
          />

          <Text highContrast={false} mt="2" size="1">
            {t('searchTabs.hint')}
          </Text>
        </View>

        <View style={styles.section}>
          <Text mb="2" size="2" weight="medium">
            {t('drawerSections.title')}
          </Text>

          <NestedReorderableList
            data={drawerSections}
            keyExtractor={(item) => item.key}
            onReorder={(event) => {
              const next = reorderItems(drawerSections, event.from, event.to)

              update({
                drawerSections: next,
              })
            }}
            renderItem={({ index, item }) => (
              <DraggableItem
                label={t(`drawerSections.${item.key}`)}
                onChange={(value) => {
                  const next = create(drawerSections, (draft) => {
                    if (draft[index]) {
                      draft[index].disabled = !value
                    }
                  })

                  update({
                    drawerSections: next,
                  })
                }}
                style={styles.item}
                value={!item.disabled}
              />
            )}
            scrollEnabled={false}
          />
        </View>
      </ScrollViewContainer>

      <Sheet.Root ref={sheet} scrollable>
        <Sheet.Header style={styles.title} title={t('feed.title')} />

        <CommunitiesList
          onPress={(item) => {
            sheet.current?.dismiss()

            if (item.type === 'community') {
              update({
                community: item.data.name,
                feed: undefined,
                feedType: undefined,
              })
            }

            if (item.type === 'feed') {
              update({
                community: undefined,
                feed: item.data.name,
                feedType: undefined,
              })
            }

            if (item.type === 'type') {
              update({
                community: undefined,
                feed: undefined,
                feedType: item.data,
              })
            }
          }}
          show={['type', 'community', 'feed']}
        />
      </Sheet.Root>
    </>
  )
}

const styles = StyleSheet.create((theme) => ({
  content: {
    paddingHorizontal: theme.space[4],
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.space[3],
    height: theme.space[8],
    paddingLeft: 0,
    paddingRight: theme.space[1],
  },
  section: {
    marginTop: theme.space[6],
  },
  title: {
    marginTop: theme.space[2],
  },
}))
