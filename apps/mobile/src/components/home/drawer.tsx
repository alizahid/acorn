import { type DrawerContentComponentProps } from '@react-navigation/drawer'
import { useState } from 'react'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { SearchBox } from '../common/search'
import { CommunitiesList } from '../communities/list'

type Props = DrawerContentComponentProps

export function HomeDrawer({ navigation }: Props) {
  const [query, setQuery] = useState('')

  return (
    <>
      <View style={styles.header}>
        <SearchBox onChange={setQuery} value={query} />
      </View>

      <CommunitiesList
        onPress={() => {
          navigation.closeDrawer()
        }}
        query={query}
      />
    </>
  )
}

const styles = StyleSheet.create((theme, runtime) => ({
  header: {
    marginTop: runtime.insets.top,
    paddingRight: theme.space[1],
  },
}))
