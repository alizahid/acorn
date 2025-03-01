import { create } from 'mutative'
import { FlatList, ScrollView } from 'react-native'
import ReorderableList, { reorderItems } from 'react-native-reorderable-list'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Switch } from '~/components/common/switch'
import { Text } from '~/components/common/text'
import { DraggableItem } from '~/components/defaults/draggable-item'
import { SheetItem } from '~/components/sheets/item'
import { useList } from '~/hooks/list'
import { FeedTypeColors, FeedTypeIcons } from '~/lib/sort'
import { useDefaults } from '~/stores/defaults'
import { FeedType } from '~/types/sort'

export default function Screen() {
  const t = useTranslations('screen.settings.defaults')

  const { drawerSections, feedType, searchTabs, update } = useDefaults()

  const { styles, theme } = useStyles(stylesheet)

  const listProps = useList()

  return (
    <ScrollView {...listProps}>
      <Text highContrast={false} mb="2" mt="3" mx="3" size="2" weight="medium">
        {t('feedType.title')}
      </Text>

      <FlatList
        data={FeedType}
        renderItem={({ item }) => (
          <SheetItem
            icon={{
              color: theme.colors[FeedTypeColors[item]].accent,
              name: FeedTypeIcons[item],
              size: theme.space[4],
              type: 'icon',
              weight: 'duotone',
            }}
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

      <Text highContrast={false} mb="2" mt="6" mx="3" size="2" weight="medium">
        {t('searchTabs.title')}
      </Text>

      <ReorderableList
        data={searchTabs}
        extraData={searchTabs}
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

      <Text highContrast={false} mb="2" mt="6" mx="3" size="2" weight="medium">
        {t('drawerSections.title')}
      </Text>

      <ReorderableList
        data={drawerSections}
        extraData={drawerSections}
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

const stylesheet = createStyleSheet((theme) => ({
  list: {
    backgroundColor: theme.colors.gray.uiAlpha,
    borderCurve: 'continuous',
    borderRadius: theme.radius[4],
    flexGrow: 0,
    marginHorizontal: theme.space[3],
  },
}))
