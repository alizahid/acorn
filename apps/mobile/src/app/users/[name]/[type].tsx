import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from 'expo-router'
import { useState } from 'react'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import { HeaderButton } from '~/components/navigation/header-button'
import { TopIntervalMenu } from '~/components/posts/interval'
import { FeedSortMenu } from '~/components/posts/sort'
import { UserPostsList } from '~/components/users/posts'
import { useProfile } from '~/hooks/queries/user/profile'
import { useAuth } from '~/stores/auth'
import { type TopInterval, type UserFeedSort } from '~/types/sort'
import { UserFeedType } from '~/types/user'

const schema = z.object({
  name: z.string().catch('mildpanda'),
  type: z.enum(UserFeedType).catch('submitted'),
})

export default function Screen() {
  const router = useRouter()
  const navigation = useNavigation()

  const params = schema.parse(useLocalSearchParams())

  const t = useTranslations('tab.user.menu')

  const { accountId } = useAuth()

  const { profile, refetch } = useProfile(params.name)

  const [sort, setSort] = useState<UserFeedSort>('hot')
  const [interval, setInterval] = useState<TopInterval>()

  const show = profile && accountId !== profile.name

  useFocusEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <>
          {show ? (
            <HeaderButton
              contrast
              icon="ChatCircleText"
              onPress={() => {
                router.navigate({
                  params: {
                    name: profile.name,
                  },
                  pathname: '/users/[name]/comments',
                })
              }}
            />
          ) : null}

          <FeedSortMenu
            hideLabel
            onChange={(next) => {
              setSort(next)

              if (next === 'top') {
                setInterval('hour')
              } else {
                setInterval(undefined)
              }
            }}
            type="user"
            value={sort}
          />

          {sort === 'top' ? (
            <TopIntervalMenu
              hideLabel
              onChange={setInterval}
              value={interval}
            />
          ) : null}
        </>
      ),
      title: t(params.type),
    })
  })

  return (
    <UserPostsList
      insets={['top', 'bottom', 'header']}
      interval={interval}
      label="subreddit"
      onRefresh={refetch}
      profile={show ? profile : undefined}
      sort={sort}
      type={params.type}
      username={params.name}
    />
  )
}
