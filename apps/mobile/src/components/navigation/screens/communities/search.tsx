import { useIsFocused } from '@react-navigation/native'
import { useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useDebounce } from 'use-debounce'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import { TextBox } from '~/components/common/text-box'
import { HeaderButton } from '~/components/navigation/header-button'
import {
  type SearchFilters,
  SearchPostFilters,
} from '~/components/search/filters'
import { SearchList } from '~/components/search/list'

const schema = z.object({
  name: z.string().catch('acornblue'),
})

export type CommunitiesSearchParams = z.infer<typeof schema>

export function CommunitiesSearchScreen() {
  const params = schema.parse(useLocalSearchParams())

  const focused = useIsFocused()

  const t = useTranslations('screen.community.search')

  const { styles } = useStyles(stylesheet)

  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<SearchFilters>({
    interval: 'all',
    sort: 'relevance',
  })

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
        filters={filters}
        focused={focused}
        header={<SearchPostFilters filters={filters} onChange={setFilters} />}
        query={debounced}
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
