import { useIsFocused } from '@react-navigation/native'
import { useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useDebounce } from 'use-debounce'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import { IconButton } from '~/components/common/icon-button'
import { TextBox } from '~/components/common/text-box'
import { Header } from '~/components/navigation/header'
import { SortIntervalMenu } from '~/components/posts/sort-interval'
import { SearchList } from '~/components/search/list'
import { useList } from '~/hooks/list'
import { usePreferences } from '~/stores/preferences'

const schema = z.object({
  name: z.string().catch('acornblue'),
  query: z.string().optional(),
})

export type CommunitiesSearchParams = z.infer<typeof schema>

export default function Screen() {
  const params = schema.parse(useLocalSearchParams())
  const focused = useIsFocused()

  const t = useTranslations('screen.community.search')

  const { intervalSearchPosts, sortSearchPosts } = usePreferences()

  const { styles, theme } = useStyles(stylesheet)

  const listProps = useList({
    top: theme.space[7] + theme.space[4],
  })

  const [sort, setSort] = useState(sortSearchPosts)
  const [interval, setInterval] = useState(intervalSearchPosts)

  const [query, setQuery] = useState(params.query ?? '')

  const [debounced] = useDebounce(query, 500)

  return (
    <>
      <Header back title={params.name}>
        <TextBox
          onChangeText={setQuery}
          placeholder={t('placeholder')}
          returnKeyType="search"
          right={
            query.length > 0 ? (
              <IconButton
                icon={{
                  color: 'gray',
                  name: 'XCircle',
                  weight: 'fill',
                }}
                onPress={() => {
                  setQuery('')
                }}
                style={styles.clear}
              />
            ) : null
          }
          styleContent={styles.query}
          value={query}
        />
      </Header>

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
        listProps={listProps}
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
    backgroundColor: theme.colors.gray.ui,
    borderWidth: 0,
    marginBottom: theme.space[4],
    marginHorizontal: theme.space[3],
  },
}))
