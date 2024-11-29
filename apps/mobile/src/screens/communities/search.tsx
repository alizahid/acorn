import { useIsFocused } from '@react-navigation/native'
import { useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useDebounce } from 'use-debounce'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import { TextBox } from '~/components/common/text-box'
import { HeaderButton } from '~/components/navigation/header-button'
import { SortIntervalMenu } from '~/components/posts/sort-interval'
import { SearchList } from '~/components/search/list'
import { usePreferences } from '~/stores/preferences'

const schema = z.object({
  name: z.string().catch('acornblue'),
  query: z.string().optional(),
})

export type CommunitiesSearchParams = z.infer<typeof schema>

export function CommunitiesSearchScreen() {
  const params = schema.parse(useLocalSearchParams())

  const focused = useIsFocused()

  const t = useTranslations('screen.community.search')

  const { intervalSearchPosts, sortSearchPosts } = usePreferences()

  const { styles } = useStyles(stylesheet)

  const [sort, setSort] = useState(sortSearchPosts)
  const [interval, setInterval] = useState(intervalSearchPosts)

  const [query, setQuery] = useState(params.query ?? '')

  const [debounced] = useDebounce(query, 500)

  return (
    <>
      <TextBox
        onChangeText={setQuery}
        placeholder={t('placeholder')}
        returnKeyType="search"
        right={
          query.length > 0 ? (
            <HeaderButton
              color="gray"
              icon="XCircle"
              onPress={() => {
                setQuery('')
              }}
              style={styles.clear}
              weight="fill"
            />
          ) : null
        }
        styleContent={styles.query}
        value={query}
      />

      <SearchList
        community={params.name}
        focused={focused}
        header={
          <SortIntervalMenu
            interval={interval}
            onChange={(next) => {
              setSort(next.sort)

              if (next.interval) {
                setInterval(next.interval)
              }
            }}
            sort={sort}
            type="search"
          />
        }
        interval={interval}
        onChangeQuery={setQuery}
        query={debounced}
        sort={sort}
        type="post"
      />
    </>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  clear: {
    height: theme.space[7],
    width: theme.space[7],
  },
  query: {
    backgroundColor: theme.colors.gray.a3,
    borderWidth: 0,
    marginBottom: theme.space[4],
    marginHorizontal: theme.space[3],
  },
}))
