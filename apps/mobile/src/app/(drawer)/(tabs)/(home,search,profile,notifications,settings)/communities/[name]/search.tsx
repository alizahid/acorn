import { useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useDebounce } from 'use-debounce'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import { IconButton } from '~/components/common/icon/button'
import { TextBox } from '~/components/common/text-box'
import { SortIntervalMenu } from '~/components/posts/sort-interval'
import { SearchList } from '~/components/search/list'
import { iPad } from '~/lib/common'
import { usePreferences } from '~/stores/preferences'
import { oledTheme } from '~/styles/oled'

const schema = z.object({
  name: z.string().catch('acornblue'),
  query: z.string().optional(),
})

export type CommunitiesSearchParams = z.infer<typeof schema>

export default function Screen() {
  const params = schema.parse(useLocalSearchParams())

  const t = useTranslations('screen.community.search')
  const a11y = useTranslations('a11y')

  const { intervalSearchPosts, sortSearchPosts, themeOled, themeTint } =
    usePreferences()

  styles.useVariants({
    iPad,
    oled: themeOled,
    tint: themeTint,
  })

  const [sort, setSort] = useState(sortSearchPosts)
  const [interval, setInterval] = useState(intervalSearchPosts)

  const [query, setQuery] = useState(params.query ?? '')

  const [debounced] = useDebounce(query, 500)

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
                  color="gray"
                  icon="xmark.circle.fill"
                  label={a11y('clearQuery')}
                  onPress={() => {
                    setQuery('')
                  }}
                  style={styles.clear}
                />
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
      onChangeQuery={setQuery}
      query={debounced}
      sort={sort}
      style={styles.list}
      type="post"
    />
  )
}

const styles = StyleSheet.create((theme) => ({
  clear: {
    height: theme.space[7],
    width: theme.space[7],
  },
  header: {
    backgroundColor: theme.colors.gray.bg,
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
      oled: {
        true: {
          backgroundColor: oledTheme[theme.variant].bgAlpha,
        },
      },
      tint: {
        true: {
          backgroundColor: theme.colors.accent.bg,
        },
      },
    },
  },
  list: {
    variants: {
      iPad: {
        true: {
          paddingBottom: theme.space[4],
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
