import { useLocalSearchParams, useRouter } from 'expo-router'
import { useMemo } from 'react'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import { FloatingButton } from '~/components/common/floating-button'
import { IconButton } from '~/components/common/icon/button'
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

  styles.useVariants({
    iPad,
    oled: themeOled,
    tint: themeTint,
  })

  const listProps = useList()

  const { sorting, update } = useSorting('community', params.name)

  const sticky = useMemo<HeaderProps>(
    () => ({
      back: true,
      children: (
        <View direction="row" style={styles.header}>
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
    [a11y, params.name, router.push, sorting.interval, sorting.sort, update],
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

const styles = StyleSheet.create((theme) => ({
  header: {
    backgroundColor: theme.colors.gray.bg,
    variants: {
      oled: {
        true: {
          backgroundColor: oledTheme[theme.variant].bgAlpha,
          borderBottomColor: theme.colors.gray.border,
          borderBottomWidth: StyleSheet.hairlineWidth,
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
    paddingBottom: heights.floatingButton,
    paddingTop: heights.header,
    variants: {
      iPad: {
        true: {
          paddingBottom: heights.floatingButton + theme.space[4],
          paddingHorizontal: theme.space[4],
          paddingTop: heights.header + theme.space[4],
        },
      },
    },
  },
}))
