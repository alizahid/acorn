import { useScrollToTop } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from 'expo-router'
import { useRef } from 'react'
import { View } from 'react-native'
import { Empty } from 'react-native-phosphor'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import { CommentCard } from '~/components/comments/card'
import { Loading } from '~/components/common/loading'
import { Pressable } from '~/components/common/pressable'
import { RefreshControl } from '~/components/common/refresh-control'
import { Spinner } from '~/components/common/spinner'
import { useCommon } from '~/hooks/common'
import { useComments } from '~/hooks/queries/user/comments'
import { type Comment } from '~/types/comment'

const schema = z.object({
  name: z.string().catch('mildpanda'),
})

export default function Screen() {
  const router = useRouter()
  const navigation = useNavigation()
  const params = schema.parse(useLocalSearchParams())

  const t = useTranslations('tab.user.menu')

  const { styles } = useStyles(stylesheet)

  useFocusEffect(() => {
    navigation.setOptions({
      title: t('comments'),
    })
  })

  const list = useRef<FlashList<Comment>>(null)

  const common = useCommon()

  // @ts-expect-error -- go away
  useScrollToTop(list)

  const {
    comments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useComments(params.name)

  return (
    <FlashList
      {...common.listProps({
        header: true,
      })}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListEmptyComponent={isLoading ? <Loading /> : <Empty />}
      ListFooterComponent={() =>
        isFetchingNextPage ? <Spinner style={styles.spinner} /> : null
      }
      contentContainerStyle={styles.main(
        common.headerHeight,
        common.insets.bottom,
      )}
      data={comments}
      estimatedItemSize={72}
      getItemType={(item) => item.type}
      keyExtractor={(item) => item.data.id}
      onEndReached={() => {
        if (hasNextPage) {
          void fetchNextPage()
        }
      }}
      ref={list}
      refreshControl={
        <RefreshControl offset={common.headerHeight} onRefresh={refetch} />
      }
      renderItem={({ item }) => {
        if (item.type === 'reply') {
          return (
            <Pressable
              onPress={() => {
                router.navigate(`/posts/${item.data.postId}`)
              }}
            >
              <CommentCard comment={item.data} />
            </Pressable>
          )
        }

        return null
      }}
    />
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: (top: number, bottom: number) => ({
    paddingBottom: bottom,
    paddingTop: top,
  }),
  separator: {
    height: theme.space[5],
  },
  spinner: {
    margin: theme.space[4],
  },
}))
