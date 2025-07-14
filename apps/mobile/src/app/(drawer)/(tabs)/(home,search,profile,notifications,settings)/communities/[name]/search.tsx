import { useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { type ViewStyle } from 'react-native'
import {
  createStyleSheet,
  type UnistylesValues,
  useStyles,
} from 'react-native-unistyles'
import { useDebounce } from 'use-debounce'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import { IconButton } from '~/components/common/icon-button'
import { TextBox } from '~/components/common/text-box'
import { View } from '~/components/common/view'
import { Header } from '~/components/navigation/header'
import { SortIntervalMenu } from '~/components/posts/sort-interval'
import { SearchList } from '~/components/search/list'
import { useFocused } from '~/hooks/focus'
import { ListFlags, useList } from '~/hooks/list'
import { heights, iPad } from '~/lib/common'
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

  const { focused } = useFocused()

  const { styles } = useStyles(stylesheet)

  const listProps = useList(ListFlags.ALL, {
    top: heights.notifications,
  })

  const [sort, setSort] = useState(sortSearchPosts)
  const [interval, setInterval] = useState(intervalSearchPosts)

  const [query, setQuery] = useState(params.query ?? '')

  const [debounced] = useDebounce(query, 500)

  return (
    <>
      <Header back title={params.name}>
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
                icon={{
                  color: 'gray',
                  name: 'XCircle',
                  weight: 'fill',
                }}
                label={a11y('clearQuery')}
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
          <View style={styles.header(themeOled, themeTint) as ViewStyle}>
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
    </>
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  clear: {
    height: theme.space[7],
    width: theme.space[7],
  },
  header: (oled: boolean, tint: boolean) => {
    const base: UnistylesValues = {
      backgroundColor: oled
        ? oledTheme[theme.name].bgAlpha
        : theme.colors[tint ? 'accent' : 'gray'].bg,
      borderBottomColor: theme.colors.gray.border,
      borderBottomWidth: runtime.hairlineWidth,
    }

    if (iPad) {
      return {
        ...base,
        marginBottom: theme.space[4],
        marginHorizontal: -theme.space[4],
      }
    }

    return base
  },
  list: {
    paddingBottom: iPad ? theme.space[4] : undefined,
    paddingHorizontal: iPad ? theme.space[4] : undefined,
  },
  query: {
    backgroundColor: theme.colors.gray.uiActiveAlpha,
    borderWidth: 0,
    marginBottom: theme.space[4],
    marginHorizontal: theme.space[3],
  },
}))
