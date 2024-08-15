import { useFocusEffect, useNavigation, useRouter } from 'expo-router'
import { useTranslations } from 'use-intl'

import { type IconName } from '~/components/common/icon'
import { SettingsMenu } from '~/components/settings/menu'
import { ProfileCard } from '~/components/users/profile'
import { useProfile } from '~/hooks/queries/user/profile'
import { useAuth } from '~/stores/auth'
import { UserFeedType } from '~/types/user'

export default function Screen() {
  const router = useRouter()
  const navigation = useNavigation()

  const t = useTranslations('tab.user')

  const { accountId } = useAuth()
  const { profile, refetch } = useProfile(accountId)

  useFocusEffect(() => {
    if (!profile) {
      return
    }

    navigation.setOptions({
      title: profile.name,
    })
  })

  return (
    <SettingsMenu
      header={<ProfileCard profile={profile} />}
      insets={['top', 'bottom', 'header', 'tabBar']}
      items={UserFeedType.map((item) => ({
        arrow: true,
        icon: {
          name: icons[item],
        },
        label: t(`menu.${item}`),
        onPress() {
          if (!profile) {
            return
          }

          router.navigate(`/users/${profile.name}/${item}`)
        },
      }))}
      onRefresh={refetch}
    />
  )
}

const icons: Record<UserFeedType, IconName> = {
  comments: 'ChatCircleText',
  downvoted: 'ArrowFatDown',
  saved: 'BookmarkSimple',
  submitted: 'PaperPlaneTilt',
  upvoted: 'ArrowFatUp',
}
