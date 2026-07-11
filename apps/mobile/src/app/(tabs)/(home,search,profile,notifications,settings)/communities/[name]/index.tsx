import { useLocalSearchParams, useRouter } from 'expo-router'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import { FloatingButton } from '~/components/common/floating-button'
import { Icon } from '~/components/common/icon'
import { SearchBox } from '~/components/common/search'
import { PostList } from '~/components/posts/list'
import { SortIntervalMenu } from '~/components/posts/sort-interval'
import { useListProps } from '~/hooks/list'
import { useSorting } from '~/hooks/sorting'
import { heights, iPad } from '~/lib/common'
import { space } from '~/styles/tokens'

const schema = z.object({
  name: z.string().catch('acornblue'),
})

export type CommunityParams = z.infer<typeof schema>

export default function Screen() {
  const router = useRouter()
  const params = schema.parse(useLocalSearchParams())

  const a11y = useTranslations('a11y')

  styles.useVariants({
    iPad,
  })

  const { sorting, update } = useSorting('community', params.name)

  const listProps = useListProps({
    extraBottom: heights.floatingButton,
    extraTop: space[4],
  })

  return (
    <>
      <PostList
        community={params.name}
        header={
          <View style={styles.header}>
            <SearchBox
              onSubmitEditing={(event) => {
                const query = event.nativeEvent.text

                if (query.length > 2) {
                  router.navigate({
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
        label={a11y('createPost')}
        onPress={() => {
          router.navigate({
            params: {
              name: params.name,
            },
            pathname: '/posts/new',
          })
        }}
      >
        <Icon name="plus-bold" />
      </FloatingButton>
    </>
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
}))
