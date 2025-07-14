import { useLocalSearchParams, useRouter } from 'expo-router'
import { useMemo } from 'react'
import { type ViewStyle } from 'react-native'
import {
  createStyleSheet,
  type UnistylesValues,
  useStyles,
} from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import { FloatingButton } from '~/components/common/floating-button'
import { IconButton } from '~/components/common/icon-button'
import { SearchBox } from '~/components/common/search'
import { View } from '~/components/common/view'
import { type HeaderProps } from '~/components/navigation/header'
import { PostList } from '~/components/posts/list'
import { SortIntervalMenu } from '~/components/posts/sort-interval'
import { useList } from '~/hooks/list'
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

  const listProps = useList()

  const { sorting, update } = useSorting('community', params.name)

  const sticky = useMemo<HeaderProps>(
    () => ({
      back: true,
      children: (
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
      ),
      right: (
        <IconButton
          icon={{
            name: 'Info',
            weight: 'duotone',
          }}
          label={a11y('aboutCommunity', {
            community: params.name,
          })}
          onPress={() => {
            router.push({
              params: {
                name: params.name,
              },
              pathname: '/communities/[name]/about',
            })
          }}
        />
      ),
      title: params.name,
    }),
    [
      a11y,
      params.name,
      router.push,
      sorting.interval,
      sorting.sort,
      styles.header,
      themeOled,
      themeTint,
      update,
    ],
  )

  return (
    <>
      <PostList
        community={params.name}
        interval={sorting.interval}
        listProps={listProps}
        sort={sorting.sort}
        sticky={sticky}
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
    }

    if (oled) {
      return {
        ...base,
        borderBottomColor: theme.colors.gray.border,
        borderBottomWidth: runtime.hairlineWidth,
      }
    }

    return base
  },
  list: {
    paddingBottom: heights.floatingButton + (iPad ? theme.space[4] : 0),
    paddingHorizontal: iPad ? theme.space[4] : undefined,
    paddingTop: heights.header + (iPad ? theme.space[4] : 0),
  },
}))
