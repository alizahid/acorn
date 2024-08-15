import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from 'expo-router'
import { useState } from 'react'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import { CommentsSortMenu } from '~/components/comments/sort'
import { HeaderButton } from '~/components/navigation/header-button'
import { TopIntervalMenu } from '~/components/posts/interval'
import { UserCommentsList } from '~/components/users/comments'
import { useProfile } from '~/hooks/queries/user/profile'
import { useAuth } from '~/stores/auth'
import { usePreferences } from '~/stores/preferences'

const schema = z.object({
  name: z.string().catch('mildpanda'),
})

export default function Screen() {
  const router = useRouter()
  const navigation = useNavigation()

  const params = schema.parse(useLocalSearchParams())

  const t = useTranslations('tab.user.menu')

  const { accountId } = useAuth()
  const { userCommentSort, userInterval } = usePreferences()

  const { profile, refetch } = useProfile(params.name)

  const [sort, setSort] = useState(userCommentSort)
  const [interval, setInterval] = useState(userInterval)

  const show = profile && accountId !== profile.name

  useFocusEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <>
          {show ? (
            <HeaderButton
              contrast
              icon="PaperPlaneTilt"
              onPress={() => {
                router.navigate({
                  params: {
                    name: profile.name,
                    type: 'submitted',
                  },
                  pathname: '/users/[name]/[type]',
                })
              }}
            />
          ) : null}

          <CommentsSortMenu onChange={setSort} value={sort} />

          {sort === 'top' ? (
            <TopIntervalMenu
              hideLabel
              onChange={setInterval}
              value={interval}
            />
          ) : null}
        </>
      ),
      title: t('comments'),
    })
  })

  return (
    <UserCommentsList
      insets={['top', 'bottom', 'header']}
      onRefresh={refetch}
      profile={show ? profile : undefined}
      user={params.name}
    />
  )
}
