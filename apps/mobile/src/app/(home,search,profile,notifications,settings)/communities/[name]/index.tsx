import { useLocalSearchParams, useRouter } from 'expo-router'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { z } from 'zod'

import { FloatingButton } from '~/components/common/floating-button'
import { View } from '~/components/common/view'
import { CommunitySearchBar } from '~/components/communities/search-bar'
import { PostList } from '~/components/posts/list'
import { SortIntervalMenu } from '~/components/posts/sort-interval'
import { useList } from '~/hooks/list'
import { useSorting } from '~/hooks/sorting'
import { iPad } from '~/lib/common'

const schema = z.object({
  name: z.string().catch('acornblue'),
})

export type CommunityParams = z.infer<typeof schema>

export default function Screen() {
  const router = useRouter()

  const params = schema.parse(useLocalSearchParams())

  const { styles, theme } = useStyles(stylesheet)

  const listProps = useList({
    padding: {
      bottom: theme.space[8] + theme.space[4] + theme.space[4],
      horizontal: iPad ? theme.space[4] : undefined,
      top: iPad ? theme.space[4] : undefined,
    },
  })

  const { sorting, update } = useSorting('community', params.name)

  return (
    <>
      <PostList
        community={params.name}
        header={
          <View direction="row" style={styles.header()}>
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
  header: () => {
    if (iPad) {
      return {
        borderBottomColor: theme.colors.gray.border,
        borderBottomWidth: runtime.hairlineWidth,
        marginBottom: theme.space[4],
        marginHorizontal: -theme.space[4],
        marginTop: -theme.space[4],
      }
    }

    return {}
  },
}))
