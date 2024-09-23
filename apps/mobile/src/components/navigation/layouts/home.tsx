import { Stack } from 'expo-router'
import { useTranslations } from 'use-intl'

import { Header } from '~/components/navigation/header'
import { TopIntervalMenu } from '~/components/posts/interval'
import { FeedSortMenu } from '~/components/posts/sort'
import { FeedTypeMenu } from '~/components/posts/type'
import { usePreferences } from '~/stores/preferences'

export function HomeLayout() {
  const t = useTranslations('screen')

  const { feedType, intervalFeedPosts, sortFeedPosts, update } =
    usePreferences()

  return (
    <Stack
      screenOptions={{
        fullScreenGestureEnabled: true,
        header: (props) => <Header {...props} />,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerLeft: () => (
            <FeedTypeMenu
              hideLabel
              onChange={(next) => {
                update({
                  feedType: next,
                })
              }}
              value={feedType}
            />
          ),
          headerRight: () => (
            <>
              <FeedSortMenu
                hideLabel
                onChange={(next) => {
                  update({
                    sortFeedPosts: next,
                  })
                }}
                value={sortFeedPosts}
              />

              {sortFeedPosts === 'top' ? (
                <TopIntervalMenu
                  hideLabel
                  onChange={(next) => {
                    update({
                      intervalFeedPosts: next,
                    })
                  }}
                  value={intervalFeedPosts}
                />
              ) : null}
            </>
          ),
        }}
      />

      <Stack.Screen
        name="posts/[id]/reply"
        options={{
          presentation: 'modal',
          title: t('posts.reply.title'),
        }}
      />
    </Stack>
  )
}
