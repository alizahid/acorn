import { useLocalSearchParams, useRouter } from 'expo-router'
import { type ViewStyle } from 'react-native'
import {
  createStyleSheet,
  type UnistylesValues,
  useStyles,
} from 'react-native-unistyles'
import { z } from 'zod'

import { FloatingButton } from '~/components/common/floating-button'
import { View } from '~/components/common/view'
import { CommunitySearchBar } from '~/components/communities/search-bar'
import { PostList } from '~/components/posts/list'
import { SortIntervalMenu } from '~/components/posts/sort-interval'
import { useList } from '~/hooks/list'
import { useSorting } from '~/hooks/sorting'
import { iPad } from '~/lib/common'
import { usePreferences } from '~/stores/preferences'
import { oledTheme } from '~/styles/oled'

const schema = z.object({
  name: z.string().catch('acornblue'),
})

export type CommunityParams = z.infer<typeof schema>

export default function Screen() {
  const router = useRouter()

  const params = schema.parse(useLocalSearchParams())

  const { themeOled, themeTint } = usePreferences()

  const { styles } = useStyles(stylesheet)

  const listProps = useList()

  const { sorting, update } = useSorting('community', params.name)

  return (
    <>
      <PostList
        community={params.name}
        header={
          <View
            direction="row"
            style={styles.header(themeOled, themeTint) as ViewStyle}
          >
            <CommunitySearchBar name={params.name} />

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
        }
        interval={sorting.interval}
        listProps={listProps}
        sort={sorting.sort}
        sticky
        style={styles.list()}
      />

      <FloatingButton
        icon="Plus"
        onPress={() => {
          router.push({
            params: {
              name: params.name,
            },
            pathname: '/communities/[name]/new',
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
  list: () => ({
    flexGrow: 1,
    paddingBottom: iPad ? theme.space[4] : undefined,
    paddingHorizontal: iPad ? theme.space[4] : undefined,
  }),
}))
