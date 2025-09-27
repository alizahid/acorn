import { create } from 'mutative'
import { FlatList, ScrollView } from 'react-native'
import ReorderableList, { reorderItems } from 'react-native-reorderable-list'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { ListItem } from '~/components/common/list/item'
import { Menu } from '~/components/common/menu'
import { Switch } from '~/components/common/switch'
import { Text } from '~/components/common/text'
import { DraggableItem } from '~/components/defaults/draggable-item'
import { useList } from '~/hooks/list'
import { FeedTypeColors, FeedTypeIcons } from '~/lib/sort'
import { useDefaults } from '~/stores/defaults'
import { FeedType } from '~/types/sort'

export default function Screen() {
  const t = useTranslations('screen.settings.defaults')

  const { drawerSections, feedType, searchTabs, tabs, update } = useDefaults()

  const listProps = useList()

  return (
    <ScrollView {...listProps} contentContainerStyle={styles.content}>
      <Menu.Label>{t('feedType.title')}</Menu.Label>

      <FlatList
        data={FeedType}
        renderItem={({ item }) => (
          <ListItem
            icon={
              <Icon
                name={FeedTypeIcons[item]}
                uniProps={(theme) => ({
                  tintColor: theme.colors[FeedTypeColors[item]].accent,
                })}
              />
            }
            label={t(`feedType.${item}`)}
            onPress={() => null}
            right={
              <Switch
                onChange={() => {
                  update({
                    feedType: item,
                  })
                }}
                value={item === feedType}
              />
            }
          />
        )}
        scrollEnabled={false}
        style={styles.list}
      />

      <Menu.Label mt="6">{t('tabs.title')}</Menu.Label>

      <ReorderableList
        data={tabs}
        keyExtractor={(item) => item.key}
        onReorder={(event) => {
          const next = reorderItems(tabs, event.from, event.to)

          update({
            tabs: next,
          })
        }}
        renderItem={({ index, item }) => (
          <DraggableItem
            label={t(`tabs.${item.key}`)}
            onChange={(value) => {
              const next = create(tabs, (draft) => {
                if (draft[index]) {
                  draft[index].disabled = !value
                }
              })

              const disabled = next.filter(($item) => $item.disabled)

              if (disabled.length === tabs.length) {
                return
              }

              update({
                tabs: next,
              })
            }}
            value={!item.disabled}
          />
        )}
        scrollEnabled={false}
        style={styles.list}
      />

      <Menu.Label mt="6">{t('searchTabs.title')}</Menu.Label>

      <ReorderableList
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
            value={!item.disabled}
          />
        )}
        scrollEnabled={false}
        style={styles.list}
      />

      <Text highContrast={false} mt="2" mx="3" size="2">
        {t('searchTabs.hint')}
      </Text>

      <Menu.Label mt="6">{t('drawerSections.title')}</Menu.Label>

      <ReorderableList
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
            value={!item.disabled}
          />
        )}
        scrollEnabled={false}
        style={styles.list}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create((theme) => ({
  content: {
    paddingBottom: theme.space[4],
    paddingHorizontal: theme.space[4],
    paddingTop: theme.space[1],
  },
  list: {
    backgroundColor: theme.colors.gray.bgAltAlpha,
    borderCurve: 'continuous',
    borderRadius: theme.radius[4],
    flexGrow: 0,
  },
}))
