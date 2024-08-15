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
import { removePrefix } from '~/lib/reddit'
import { useAuth } from '~/stores/auth'
import { usePreferences } from '~/stores/preferences'
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
  const { userInterval, userSort } = usePreferences()

  const { profile, refetch } = useProfile(params.name)

  const [sort, setSort] = useState(userSort)
  const [interval, setInterval] = useState(userInterval)

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
                    name: removePrefix(profile.name),
                  },
                  pathname: '/users/[name]/comments',
                })
              }}
            />
          ) : null}

          <FeedSortMenu hideLabel onChange={setSort} type="user" value={sort} />

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
