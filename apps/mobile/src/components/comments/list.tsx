import { FlashList } from '@shopify/flash-list'
import { useRouter } from 'expo-router'
import { type ReactElement } from 'react'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { RefreshControl } from '~/components/common/refresh-control'
import { Spinner } from '~/components/common/spinner'
import { type ListProps } from '~/hooks/list'
import { type CommentsProps, useComments } from '~/hooks/queries/user/comments'
import { usePreferences } from '~/stores/preferences'

import { Empty } from '../common/empty'
import { Loading } from '../common/loading'
import { View } from '../common/view'
import { CommentCard } from './card'

type Props = CommentsProps & {
  header?: ReactElement
  listProps?: ListProps
  onRefresh?: () => void
}

export function CommentList({
  header,
  interval,
  listProps,
  onRefresh,
  query,
  sort,
  user,
}: Props) {
  const router = useRouter()

  const { themeOled } = usePreferences()

  const { styles } = useStyles(stylesheet)

  const {
    comments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useComments({
    interval,
    query,
    sort,
    user,
  })

  return (
    <FlashList
      {...listProps}
      ItemSeparatorComponent={() => (
        <View style={styles.separator(themeOled)} />
      )}
      ListEmptyComponent={isLoading ? <Loading /> : <Empty />}
      ListFooterComponent={() =>
        isFetchingNextPage ? <Spinner m="6" /> : null
      }
      ListHeaderComponent={header}
      data={comments}
      estimatedItemSize={72}
      getItemType={(item) => item.type}
      keyExtractor={(item) => item.data.id}
      onEndReached={() => {
        if (hasNextPage) {
          void fetchNextPage()
        }
      }}
      refreshControl={
        <RefreshControl
          offset={listProps?.progressViewOffset}
          onRefresh={() => {
            onRefresh?.()

            return refetch()
          }}
        />
      }
      renderItem={({ item }) => {
        if (item.type === 'reply') {
          return (
            <CommentCard
              comment={item.data}
              dull
              onPress={() => {
                router.navigate({
                  params: {
                    commentId: item.data.id,
                    id: item.data.post.id,
                  },
                  pathname: '/posts/[id]',
                })
              }}
            />
          )
        }

        return null
      }}
    />
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  separator: (oled: boolean) => ({
    backgroundColor: oled ? theme.colors.gray.border : undefined,
    height: oled ? runtime.hairlineWidth : theme.space[4],
  }),
}))
