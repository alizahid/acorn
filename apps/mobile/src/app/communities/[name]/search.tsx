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
import { type Insets, useCommon } from '~/hooks/common'

const schema = z.object({
  name: z.string().catch('acornapp'),
})

export default function Screen() {
  const navigation = useNavigation()

  const focused = useIsFocused()

  const t = useTranslations('screen.communities.search')

  const common = useCommon()

  useFocusEffect(() => {
    navigation.setOptions({
      title: t('title', {
        community: params.name,
      }),
    })
  })

  const { styles, theme } = useStyles(stylesheet)

  const params = schema.parse(useLocalSearchParams())

  const [query, setQuery] = useState('')

  const [filters, setFilters] = useState<SearchFilters>({
    interval: 'all',
    sort: 'relevance',
  })

  const [value] = useDebounce(query, 500)

  const insets: Insets = ['bottom']

  return (
    <View flexGrow={1} style={styles.main(common.height.header)}>
      <View justify="center">
        <Icon
          color={theme.colors.gray.a9}
          name="MagnifyingGlass"
          style={styles.search}
        />

        <TextBox
          onChangeText={setQuery}
          placeholder={t('title', {
            community: params.name,
          })}
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

      <SearchPostFilters filters={filters} onChange={setFilters} />

      <SearchList
        community={params.name}
        focused={focused}
        insets={insets}
        query={value}
        type="post"
      />
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  clear: {
    position: 'absolute',
    right: 0,
    width: theme.space[7],
  },
  input: {
    backgroundColor: theme.colors.gray.a3,
    borderRadius: 0,
    borderWidth: 0,
    height: theme.space[8],
    paddingLeft: theme.space[2] + theme.space[5] + theme.space[2],
  },
  main: (top: number) => ({
    paddingTop: top,
  }),
  search: {
    left: theme.space[2],
    position: 'absolute',
  },
}))
