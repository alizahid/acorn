import { useScrollToTop } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from 'expo-router'
import { useRef } from 'react'
import { View } from 'react-native'
import { Empty } from 'react-native-phosphor'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { CommentCard } from '~/components/comments/card'
import { Loading } from '~/components/common/loading'
import { RefreshControl } from '~/components/common/refresh-control'
import { Spinner } from '~/components/common/spinner'
import { useComments } from '~/hooks/queries/user/comments'
import { type Comment } from '~/types/comment'

type Params = {
  name: string
}

export default function Screen() {
  const navigation = useNavigation()
  const params = useLocalSearchParams<Params>()

  const t = useTranslations('screen.user.index.menu')

  const { styles } = useStyles(stylesheet)

  useFocusEffect(() => {
    navigation.setOptions({
      title: t('comments'),
    })
  })

  const list = useRef<FlashList<Comment>>(null)

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
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListEmptyComponent={isLoading ? <Loading /> : <Empty />}
      ListFooterComponent={() =>
        isFetchingNextPage ? <Spinner style={styles.spinner} /> : null
      }
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
      refreshControl={<RefreshControl onRefresh={refetch} />}
      renderItem={({ item }) => {
        if (item.type === 'reply') {
          return <CommentCard comment={item.data} />
        }

        return null
      }}
      scrollIndicatorInsets={{
        bottom: 1,
        right: 1,
        top: 1,
      }}
    />
  )
}

const stylesheet = createStyleSheet((theme) => ({
  separator: {
    height: theme.space[5],
  },
  spinner: {
    margin: theme.space[4],
  },
}))
