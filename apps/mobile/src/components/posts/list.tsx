import { useIsFocused, useScrollToTop } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import { useRouter } from 'expo-router'
import { type ReactElement, useMemo, useRef, useState } from 'react'
import { type ViewabilityConfigCallbackPairs } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { RefreshControl } from '~/components/common/refresh-control'
import { Spinner } from '~/components/common/spinner'
import { PostCard } from '~/components/posts/card'
import { useHistory } from '~/hooks/history'
import { type ListProps } from '~/hooks/list'
import { type PostsProps, usePosts } from '~/hooks/queries/posts/posts'
import { cardMaxWidth, iPad } from '~/lib/common'
import { usePreferences } from '~/stores/preferences'
import { type Comment } from '~/types/comment'
import { type Post } from '~/types/post'

import { CommentCard } from '../comments/card'
import { Empty } from '../common/empty'
import { Loading } from '../common/loading'
import { View } from '../common/view'
import { type PostLabel } from './footer'

type Props = PostsProps & {
  header?: ReactElement
  label?: PostLabel
  listProps?: ListProps
  onRefresh?: () => void
}

export function PostList({
  community,
  feed,
  header,
  interval,
  label,
  listProps,
  onRefresh,
  query,
  sort,
  user,
  userType,
}: Props) {
  const router = useRouter()

  const list = useRef<FlashList<Post | Comment>>(null)

  const focused = useIsFocused()

  useScrollToTop(list)

  const { feedCompact, seenOnScroll, themeOled } = usePreferences()
  const { addPost } = useHistory()

  const { styles } = useStyles(stylesheet)

  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    posts,
    refetch,
  } = usePosts({
    community,
    feed,
    interval,
    query,
    sort,
    user,
    userType,
  })

  const viewabilityConfigCallbackPairs =
    useMemo<ViewabilityConfigCallbackPairs>(
      () => [
        {
          onViewableItemsChanged({ viewableItems }) {
            setViewing(() => viewableItems.map((item) => item.key))
          },
          viewabilityConfig: {
            viewAreaCoveragePercentThreshold: 60,
          },
        },
        {
          onViewableItemsChanged({ viewableItems }) {
            if (!seenOnScroll) {
              return
            }

            viewableItems.forEach((item) => {
              addPost({
                id: (item.item as Post).id,
              })
            })
          },
          viewabilityConfig: {
            viewAreaCoveragePercentThreshold: 60,
          },
        },
      ],
      [addPost, seenOnScroll],
    )

  const [viewing, setViewing] = useState<Array<string>>([])

  return (
    <FlashList
      {...listProps}
      ItemSeparatorComponent={() => (
        <View style={styles.separator(themeOled, feedCompact)} />
      )}
      ListEmptyComponent={isLoading ? <Loading /> : <Empty />}
      ListFooterComponent={() =>
        isFetchingNextPage ? <Spinner m="6" /> : null
      }
      ListHeaderComponent={header}
      data={posts}
      estimatedItemSize={feedCompact ? 120 : 500}
      extraData={{
        viewing,
      }}
      getItemType={(item) => {
        if (['reply', 'more'].includes(item.type)) {
          return item.type
        }

        return 'post'
      }}
      keyExtractor={(item) => {
        if (item.type === 'reply') {
          return `reply-${item.data.id}`
        }

        if (item.type === 'more') {
          return `more-${item.data.id}`
        }

        return item.id
      }}
      onEndReached={() => {
        if (hasNextPage) {
          void fetchNextPage()
        }
      }}
      ref={list}
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

        if (item.type === 'more') {
          return null
        }

        return (
          <PostCard
            label={label}
            post={item}
            viewing={focused ? viewing.includes(item.id) : false}
          />
        )
      }}
      viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs}
    />
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  separator: (oled: boolean, compact: boolean) => ({
    alignSelf: 'center',
    backgroundColor: oled ? theme.colors.gray.border : undefined,
    height: oled ? runtime.hairlineWidth : theme.space[compact ? 2 : 4],
    maxWidth: iPad ? cardMaxWidth : undefined,
    width: '100%',
  }),
}))
