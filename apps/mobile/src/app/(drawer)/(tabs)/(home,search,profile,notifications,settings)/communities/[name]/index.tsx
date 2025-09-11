import { useLocalSearchParams, useRouter } from 'expo-router'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import { FloatingButton } from '~/components/common/floating-button'
import { SearchBox } from '~/components/common/search'
import { View } from '~/components/common/view'
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

  return (
    <>
      <PostList
        community={params.name}
        header={
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
        }
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

const styles = StyleSheet.create((theme) => ({
  header: {
    backgroundColor: theme.colors.gray.bg,
    borderBottomColor: theme.colors.gray.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
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
    paddingBottom: heights.floatingButton,
    variants: {
      iPad: {
        true: {
          paddingBottom: heights.floatingButton + theme.space[4],
          paddingHorizontal: theme.space[4],
        },
      },
    },
  },
}))
