import { create } from 'mutative'
import ReorderableList, { reorderItems } from 'react-native-reorderable-list'
import { useTranslations } from 'use-intl'

import { Text } from '~/components/common/text'
import { View } from '~/components/common/view'
import { DraggableItem } from '~/components/defaults/draggable-item'
import { useList } from '~/hooks/list'
import { useDefaults } from '~/stores/defaults'

export default function Screen() {
  const t = useTranslations('screen.settings.defaults.searchTabs')

  const { searchTabs, update } = useDefaults()

  const { contentContainerStyle } = useList()

  return (
    <View gap="2" style={contentContainerStyle}>
      <ReorderableList
        ListFooterComponent={
          <Text highContrast={false} m="4" size="2">
            {t('hint')}
          </Text>
        }
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
            label={t(item.key)}
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
      />
    </View>
  )
}
