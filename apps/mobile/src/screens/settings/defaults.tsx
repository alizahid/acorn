import { ScrollView } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { DefaultsSearchTabs } from '~/components/defaults/search-tabs'
import { useDefaults } from '~/stores/defaults'

export function SettingsDefaultsScreen() {
  const { searchTabs, update } = useDefaults()

  const { styles } = useStyles(stylesheet)

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <DefaultsSearchTabs
        data={searchTabs}
        onChange={(next) => {
          update({
            searchTabs: next,
          })
        }}
      />
    </ScrollView>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  content: {
    gap: theme.space[6],
    padding: theme.space[4],
  },
}))
