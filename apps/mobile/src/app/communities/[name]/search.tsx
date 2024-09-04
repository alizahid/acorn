import { useIsFocused } from '@react-navigation/native'
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from 'expo-router'
import { useState } from 'react'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useDebounce } from 'use-debounce'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import { Icon } from '~/components/common/icon'
import { TextBox } from '~/components/common/text-box'
import { View } from '~/components/common/view'
import { HeaderButton } from '~/components/navigation/header-button'
import {
  type SearchFilters,
  SearchPostFilters,
} from '~/components/search/filters'
import { SearchList } from '~/components/search/list'

const schema = z.object({
  name: z.string().catch('acornblue'),
})

export default function Screen() {
  const navigation = useNavigation()

  const params = schema.parse(useLocalSearchParams())

  const focused = useIsFocused()

  const t = useTranslations('screen.communities.search')

  useFocusEffect(() => {
    navigation.setOptions({
      title: t('title', {
        community: params.name,
      }),
    })
  })

  const { styles, theme } = useStyles(stylesheet)

  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<SearchFilters>({
    interval: 'all',
    sort: 'relevance',
  })

  const [debounced] = useDebounce(query, 500)

  return (
    <SearchList
      community={params.name}
      focused={focused}
      header={
        <>
          <View style={styles.main}>
            <View m="4">
              <Icon
                color={theme.colors.gray.a9}
                name="MagnifyingGlass"
                style={styles.search}
              />

              <TextBox
                onChangeText={setQuery}
                placeholder={t('placeholder')}
                styleInput={styles.input}
                value={query}
              />

              {query.length > 0 ? (
                <HeaderButton
                  color="gray"
                  icon="XCircle"
                  onPress={() => {
                    setQuery('')
                  }}
                  style={styles.clear}
                  weight="fill"
                />
              ) : null}
            </View>
          </View>

          <SearchPostFilters
            filters={filters}
            onChange={setFilters}
            style={styles.filters}
          />
        </>
      }
      inset
      query={debounced}
      type="post"
    />
  )
}

const stylesheet = createStyleSheet((theme) => ({
  clear: {
    height: theme.space[7],
    position: 'absolute',
    right: 0,
    top: 0,
    width: theme.space[7],
  },
  filters: {
    paddingHorizontal: theme.space[2],
  },
  input: {
    backgroundColor: theme.colors.gray.a3,
    borderCurve: 'continuous',
    borderRadius: theme.radius[4],
    borderWidth: 0,
    paddingLeft: theme.space[2] + theme.space[5] + theme.space[2],
  },
  main: {
    backgroundColor: theme.colors.gray.a2,
  },
  search: {
    left: theme.space[2],
    position: 'absolute',
    top: theme.space[2],
  },
}))
