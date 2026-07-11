import { useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useDebounce } from 'use-debounce'
import { useTranslations } from 'use-intl'
import { z } from 'zod'
import { useShallow } from 'zustand/react/shallow'

import { Icon } from '~/components/common/icon'
import { IconButton } from '~/components/common/icon/button'
import { TextBox } from '~/components/common/text-box'
import { SortIntervalMenu } from '~/components/posts/sort-interval'
import { SearchList } from '~/components/search/list'
import { useListProps } from '~/hooks/list'
import { iPad } from '~/lib/common'
import { usePreferences } from '~/stores/preferences'
import { space } from '~/styles/tokens'

const schema = z.object({
  name: z.string().catch('acornblue'),
  query: z.string().optional(),
})

export type CommunitiesSearchParams = z.infer<typeof schema>

export default function Screen() {
  const params = schema.parse(useLocalSearchParams())

  const t = useTranslations('screen.community.search')
  const a11y = useTranslations('a11y')

  const { intervalSearchPosts, sortSearchPosts } = usePreferences(
    useShallow((state) => ({
      intervalSearchPosts: state.intervalSearchPosts,
      sortSearchPosts: state.sortSearchPosts,
    })),
  )

  styles.useVariants({
    iPad,
  })

  const [sort, setSort] = useState(sortSearchPosts)
  const [interval, setInterval] = useState(intervalSearchPosts)

  const [query, setQuery] = useState(params.query ?? '')

  const [debounced] = useDebounce(query, 500)

  const listProps = useListProps({
    extraBottom: space[4],
    extraTop: space[4],
  })

  return (
    <SearchList
      community={params.name}
      header={
        <View style={styles.header}>
          <TextBox
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect={false}
            onChangeText={setQuery}
            placeholder={t('placeholder')}
            returnKeyType="search"
            right={
              query.length > 0 ? (
                <IconButton
                  label={a11y('clearQuery')}
                  onPress={() => {
                    setQuery('')
                  }}
                  size="7"
                >
                  <Icon
                    name="x-circle-fill"
                    uniProps={(theme) => ({
                      color: theme.colors.gray.accent,
                    })}
                  />
                </IconButton>
              ) : null
            }
            style={styles.query}
            value={query}
          />

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
        </View>
      }
      interval={interval}
      listProps={listProps}
      onChangeQuery={setQuery}
      query={debounced}
      sort={sort}
      style={styles.list}
      type="post"
    />
  )
}

const styles = StyleSheet.create((theme) => ({
  header: {
    borderBottomColor: theme.colors.gray.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    variants: {
      iPad: {
        true: {
          marginBottom: theme.space[4],
          marginHorizontal: -theme.space[4],
        },
      },
    },
  },
  list: {
    variants: {
      iPad: {
        true: {
          paddingHorizontal: theme.space[4],
        },
      },
    },
  },
  query: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    flex: 1,
  },
}))
