import { create } from 'mutative'
import { ScrollView } from 'react-native'
import ReorderableList, { reorderItems } from 'react-native-reorderable-list'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { View } from '~/components/common/view'
import { DraggableItem } from '~/components/defaults/draggable-item'
import { useList } from '~/hooks/list'
import { useDefaults } from '~/stores/defaults'

export default function Screen() {
  const t = useTranslations('screen.settings.defaults.drawerSections')

  const { drawerSections, update } = useDefaults()

  const { styles } = useStyles(stylesheet)

  const listProps = useList()

  return (
    <ScrollView {...listProps}>
      <View p="4">
        <ReorderableList
          contentContainerStyle={styles.content}
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
    </ScrollView>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  content: {
    backgroundColor: theme.colors.gray.bgAlt,
    borderCurve: 'continuous',
    borderRadius: theme.radius[4],
    overflow: 'hidden',
  },
  label: {
    flex: 1,
  },
}))
