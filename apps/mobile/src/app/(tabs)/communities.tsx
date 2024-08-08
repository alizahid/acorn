import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useRef } from 'react'
import { View } from 'react-native'
import Pager from 'react-native-pager-view'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { z } from 'zod'

import { CommunitiesList } from '~/components/communities/list'

const schema = z.object({
  communitiesType: z.coerce.number().catch(0),
})

export default function Screen() {
  const router = useRouter()

  const params = schema.parse(useLocalSearchParams())

  const pager = useRef<Pager>(null)

  const { styles } = useStyles(stylesheet)

  useEffect(() => {
    pager.current?.setPage(params.communitiesType)
  }, [params.communitiesType])

  return (
    <Pager
      onPageSelected={(event) => {
        router.setParams({
          communitiesType: event.nativeEvent.position,
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
