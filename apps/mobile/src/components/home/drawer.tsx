import { type DrawerContentComponentProps } from '@react-navigation/drawer'
import { useState } from 'react'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { ListFlags, useList } from '~/hooks/list'

import { SearchBox } from '../common/search'
import { View } from '../common/view'
import { CommunitiesList } from '../communities/list'

type Props = DrawerContentComponentProps

export function HomeDrawer({ navigation }: Props) {
  const { styles } = useStyles(stylesheet)

  const listProps = useList(ListFlags.BOTTOM_INSET)

  const [query, setQuery] = useState('')

  return (
    <>
      <View pr="1" style={styles.search}>
        <SearchBox onChange={setQuery} value={query} />
      </View>

      <CommunitiesList
        listProps={listProps}
        onPress={() => {
          navigation.closeDrawer()
        }}
        query={query}
      />
    </>
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  search: {
    marginTop: runtime.insets.top,
  },
}))
