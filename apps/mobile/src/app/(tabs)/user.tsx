import { useFocusEffect, useNavigation, useRouter } from 'expo-router'
import { useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { type IconName } from '~/components/common/icon'
import { SettingsMenu } from '~/components/settings/menu'
import { ProfileCard } from '~/components/users/profile'
import { useProfile } from '~/hooks/queries/user/profile'
import { removePrefix } from '~/lib/reddit'
import { useAuth } from '~/stores/auth'
import { type ColorToken } from '~/styles/colors'
import { UserFeedType } from '~/types/user'

export default function Screen() {
  const router = useRouter()
  const navigation = useNavigation()

  const t = useTranslations('tab.user')

  const { accountId } = useAuth()
  const { profile, refetch } = useProfile(accountId)

  const { theme } = useStyles()

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
      items={UserFeedType.map((type) => ({
        arrow: true,
        icon: {
          color: theme.colors[colors[type]].a9,
          name: icons[type],
        },
        label: t(`menu.${type}`),
        onPress() {
          if (!profile) {
            return
          }

          router.navigate({
            params: {
              name: removePrefix(profile.name),
              type,
            },
            pathname: '/users/[name]/[type]',
          })
        },
      }))}
      onRefresh={refetch}
    />
  )
}

const icons: Record<UserFeedType, IconName> = {
  comments: 'ChatCircle',
  downvoted: 'ArrowFatDown',
  hidden: 'EyeClosed',
  saved: 'BookmarkSimple',
  submitted: 'PaperPlaneTilt',
  upvoted: 'ArrowFatUp',
}

const colors: Record<UserFeedType, ColorToken> = {
  comments: 'plum',
  downvoted: 'red',
  hidden: 'gray',
  saved: 'indigo',
  submitted: 'accent',
  upvoted: 'green',
}
