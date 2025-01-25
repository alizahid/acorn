import { create } from 'mutative'
import ReorderableList, { reorderItems } from 'react-native-reorderable-list'
import { useTranslations } from 'use-intl'

import { View } from '~/components/common/view'
import { DraggableItem } from '~/components/defaults/draggable-item'
import { useList } from '~/hooks/list'
import { useDefaults } from '~/stores/defaults'

export default function Screen() {
  const t = useTranslations('screen.settings.defaults.drawerSections')

  const { drawerSections, update } = useDefaults()

  const { contentContainerStyle } = useList()

  return (
    <View gap="2" style={contentContainerStyle}>
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
            label={t(item.key)}
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
      />
    </View>
  )
}
