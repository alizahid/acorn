import { useIsFocused } from '@react-navigation/native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useRef } from 'react'
import { View } from 'react-native'
import Pager from 'react-native-pager-view'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useDebounce } from 'use-debounce'
import { z } from 'zod'

import { SearchList } from '~/components/search/list'
import { type Insets } from '~/hooks/common'
import { SearchType } from '~/types/search'

const schema = z.object({
  query: z.string().catch(''),
  type: z.enum(SearchType).catch('post'),
})

export default function Screen() {
  const router = useRouter()

  const focused = useIsFocused()

  const params = schema.parse(useLocalSearchParams())

  const pager = useRef<Pager>(null)

  const [query] = useDebounce(params.query, 500)

  const { styles } = useStyles(stylesheet)

  const type = params.type

  useEffect(() => {
    const index = SearchType.indexOf(type)

    pager.current?.setPage(index)
  }, [type])

  const insets: Insets = ['top', 'bottom', 'search', 'tabBar']

  return (
    <Pager
      initialPage={0}
      onPageSelected={(event) => {
        router.setParams({
          type: SearchType[event.nativeEvent.position],
        })
      }}
      ref={pager}
      style={styles.main}
    >
      <View key="posts" style={styles.main}>
        <SearchList
          focused={focused ? type === 'post' : false}
          insets={insets}
          query={query}
          type="post"
        />
      </View>

      <View key="communities" style={styles.main}>
        <SearchList
          focused={focused ? type === 'community' : false}
          insets={insets}
          query={query}
          type="community"
        />
      </View>
    </Pager>
  )
}

const stylesheet = createStyleSheet(() => ({
  main: {
    flex: 1,
  },
}))
