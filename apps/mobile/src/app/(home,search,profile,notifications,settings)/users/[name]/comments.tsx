import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from 'expo-router'
import { useCallback, useState } from 'react'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useDebounce } from 'use-debounce'
import { z } from 'zod'

import { CommentList } from '~/components/comments/list'
import { View } from '~/components/common/view'
import { SortIntervalMenu } from '~/components/posts/sort-interval'
import { UserSearchBar } from '~/components/users/search'
import { useList } from '~/hooks/list'
import { iPad } from '~/lib/common'
import { usePreferences } from '~/stores/preferences'

const schema = z.object({
  mode: z.literal('headless').optional(),
  name: z.string().catch('mildpanda'),
})

export default function Screen() {
  const navigation = useNavigation()
  const params = schema.parse(useLocalSearchParams())

  const { intervalUserComments, sortUserComments } = usePreferences()

  const { styles, theme } = useStyles(stylesheet)

  const listProps = useList({
    padding: iPad ? theme.space[4] : 0,
    top: params.mode === 'headless' ? 0 : theme.space[7] + theme.space[4],
  })

  const [sort, setSort] = useState(sortUserComments)
  const [interval, setInterval] = useState(intervalUserComments)
  const [query, setQuery] = useState('')

  const [debounced] = useDebounce(query, 500)

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerRight: () => (
          <SortIntervalMenu
            interval={interval}
            onChange={(next) => {
              setSort(next.sort)

              if (next.interval) {
                setInterval(next.interval)
              }
            }}
            sort={sort}
            type="comment"
          />
        ),
      })
    }, [interval, navigation, sort]),
  )

  return (
    <CommentList
      header={
        <View direction="row" style={styles.header()}>
          <UserSearchBar onChange={setQuery} value={query} />
        </View>
      }
      interval={interval}
      listProps={listProps}
      query={debounced}
      sort={sort}
      user={params.name}
    />
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  header: () => {
    if (iPad) {
      return {
        borderBottomColor: theme.colors.gray.border,
        borderBottomWidth: runtime.hairlineWidth,
        marginBottom: theme.space[4],
        marginHorizontal: -theme.space[4],
        marginTop: -theme.space[4],
      }
    }

    return {}
  },
}))
