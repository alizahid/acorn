import { useLocalSearchParams, useRouter } from 'expo-router'
import { type ViewStyle } from 'react-native'
import {
  createStyleSheet,
  type UnistylesValues,
  useStyles,
} from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import { FloatingButton } from '~/components/common/floating-button'
import { SearchBox } from '~/components/common/search'
import { View } from '~/components/common/view'
import { PostList } from '~/components/posts/list'
import { SortIntervalMenu } from '~/components/posts/sort-interval'
import { ListFlags, useList } from '~/hooks/list'
import { useSorting } from '~/hooks/sorting'
import { heights, iPad } from '~/lib/common'
import { usePreferences } from '~/stores/preferences'
import { oledTheme } from '~/styles/oled'

const schema = z.object({
  name: z.string().catch('acornblue'),
})

export type CommunityParams = z.infer<typeof schema>

export default function Screen() {
  const router = useRouter()
  const params = schema.parse(useLocalSearchParams())

  const a11y = useTranslations('a11y')

  const { themeOled, themeTint } = usePreferences()

  const { styles } = useStyles(stylesheet)

  const listProps = useList(ListFlags.BOTTOM)

  const { sorting, update } = useSorting('community', params.name)

  return (
    <>
      <View
        direction="row"
        style={styles.header(themeOled, themeTint) as ViewStyle}
      >
        <SearchBox
          onSubmitEditing={(event) => {
            const query = event.nativeEvent.text

            if (query.length > 2) {
              router.push({
                params: {
                  name: params.name,
                  query,
                },
                pathname: '/communities/[name]/search',
              })
            }
          }}
          placeholder="search"
        />

        <SortIntervalMenu
          interval={sorting.interval}
          onChange={(next) => {
            update({
              interval: next.interval,
              sort: next.sort,
            })
          }}
          sort={sorting.sort}
          type="community"
        />
      </View>

      <PostList
        community={params.name}
        interval={sorting.interval}
        listProps={listProps}
        sort={sorting.sort}
        style={styles.list}
      />

      <FloatingButton
        icon="Plus"
        label={a11y('createPost')}
        onPress={() => {
          router.push({
            params: {
              name: params.name,
            },
            pathname: '/posts/new',
          })
        }}
      />
    </>
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  header: (oled: boolean, tint: boolean) => {
    const base: UnistylesValues = {
      backgroundColor: oled
        ? oledTheme[theme.name].bgAlpha
        : theme.colors[tint ? 'accent' : 'gray'].bg,
      borderBottomColor: theme.colors.gray.border,
      borderBottomWidth: runtime.hairlineWidth,
      marginTop: heights.header + runtime.insets.top,
    }

    if (iPad) {
      return {
        ...base,
        marginBottom: theme.space[4],
      }
    }

    return base
  },
  list: {
    paddingBottom: heights.floatingButton + (iPad ? theme.space[4] : 0),
    paddingHorizontal: iPad ? theme.space[4] : undefined,
  },
}))
