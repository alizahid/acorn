import { create } from 'mutative'
import { View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import {
  NestedReorderableList,
  reorderItems,
  ScrollViewContainer,
} from 'react-native-reorderable-list'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { ListItem } from '~/components/common/list/item'
import { Switch } from '~/components/common/switch'
import { Text } from '~/components/common/text'
import { DraggableItem } from '~/components/defaults/draggable-item'
import { FeedTypeColors, FeedTypeIcons } from '~/lib/sort'
import { useDefaults } from '~/stores/defaults'
import { FeedType } from '~/types/sort'

export default function Screen() {
  const t = useTranslations('screen.settings.defaults')

  const { drawerSections, feedType, searchTabs, update } = useDefaults([
    'drawerSections',
    'feedType',
    'searchTabs',
  ])

  return (
    <ScrollViewContainer contentContainerStyle={styles.content}>
      <View>
        <Text mb="2" size="2" weight="medium">
          {t('feedType.title')}
        </Text>

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
                  label={t(`feedType.${item}`)}
                  onChange={() => {
                    update({
                      feedType: item,
                    })
                  }}
                  value={item === feedType}
                />
              }
              style={styles.item}
            />
          )}
          scrollEnabled={false}
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
  )
}

const styles = StyleSheet.create((theme) => ({
  content: {
    padding: theme.space[4],
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
}))
