import { ScrollView } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { DefaultsDrawerSections } from '~/components/defaults/drawer-sections'
import { DefaultsSearchTabs } from '~/components/defaults/search-tabs'
import { useList } from '~/hooks/list'
import { useDefaults } from '~/stores/defaults'

export default function Screen() {
  const { drawerSections, searchTabs, update } = useDefaults()

  const { styles } = useStyles(stylesheet)

  const listProps = useList()

  return (
    <ScrollView
      {...listProps}
      contentContainerStyle={[listProps.contentContainerStyle, styles.content]}
    >
      <DefaultsSearchTabs
        data={searchTabs}
        onChange={(next) => {
          update({
            searchTabs: next,
          })
        }}
        style={styles.first}
      />

      <DefaultsDrawerSections
        data={drawerSections}
        onChange={(next) => {
          update({
            drawerSections: next,
          })
        }}
        style={styles.last}
      />
    </ScrollView>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  content: {
    gap: theme.space[6],
    paddingHorizontal: theme.space[4],
  },
  first: {
    marginTop: theme.space[4],
  },
  last: {
    marginBottom: theme.space[4],
  },
}))
