import { useRouter } from 'expo-router'
import { useRef } from 'react'
import { View } from 'react-native'
import Pager from 'react-native-pager-view'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { CommunitiesList } from '~/components/communities/list'

export default function Screen() {
  const router = useRouter()

  const pager = useRef<Pager>(null)

  const { styles } = useStyles(stylesheet)

  return (
    <Pager
      onPageSelected={(event) => {
        router.setParams({
          page: event.nativeEvent.position,
        })
      }}
      ref={pager}
      style={styles.main}
    >
      <View key="communities" style={styles.page}>
        <CommunitiesList type="communities" />
      </View>

      <View key="users" style={styles.page}>
        <CommunitiesList type="users" />
      </View>
    </Pager>
  )
}

const stylesheet = createStyleSheet(() => ({
  main: {
    flex: 1,
  },
  page: {
    height: '100%',
    width: '100%',
  },
}))
