import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import {
  FloatingButton,
  FloatingButtonSize,
} from '~/components/common/floating-button'
import { Icon } from '~/components/common/icon'
import { IconButton } from '~/components/common/icon/button'
import { SearchBox } from '~/components/common/search'
import { PostList } from '~/components/posts/list'
import { SortIntervalMenu } from '~/components/posts/sort-interval'
import { useListProps } from '~/hooks/list'
import { useSorting } from '~/hooks/sorting'

const schema = z.object({
  name: z.string().catch('acornblue'),
})

export type CommunityParams = z.infer<typeof schema>

export default function Screen() {
  const router = useRouter()
  const params = schema.parse(useLocalSearchParams())

  const a11y = useTranslations('a11y')

  const { sorting, update } = useSorting('community', params.name)

  const listProps = useListProps(true)

  return (
    <>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.View>
          <IconButton
            accessibilityLabel={a11y('aboutCommunity', {
              community: params.name,
            })}
            header
            onPress={() => {
              router.navigate({
                params: {
                  name: params.name,
                },
                pathname: '/communities/[name]/about',
              })
            }}
          >
            <Icon name="info" />
          </IconButton>
        </Stack.Toolbar.View>
      </Stack.Toolbar>

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
  },
  list: {
    paddingBottom: FloatingButtonSize,
  },
}))
