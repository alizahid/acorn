import { create } from 'mutative'
import { ScrollView } from 'react-native'
import ReorderableList, { reorderItems } from 'react-native-reorderable-list'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Text } from '~/components/common/text'
import { View } from '~/components/common/view'
import { DraggableItem } from '~/components/defaults/draggable-item'
import { useList } from '~/hooks/list'
import { useDefaults } from '~/stores/defaults'

export default function Screen() {
  const t = useTranslations('screen.settings.defaults.searchTabs')

  const { searchTabs, update } = useDefaults()

  const { styles } = useStyles(stylesheet)

  const listProps = useList()

  return (
    <ScrollView {...listProps}>
      <View gap="2" p="4">
        <ReorderableList
          contentContainerStyle={styles.list}
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

        <Text highContrast={false} size="2">
          {t('hint')}
        </Text>
      </View>
    </ScrollView>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  label: {
    flex: 1,
  },
  list: {
    backgroundColor: theme.colors.gray.a2,
    borderCurve: 'continuous',
    borderRadius: theme.radius[4],
    overflow: 'hidden',
  },
}))
