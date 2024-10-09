import { useRouter } from 'expo-router'
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

export function ProfileScreen() {
  const router = useRouter()

  const t = useTranslations('screen.profile')

  const { accountId } = useAuth()
  const { profile, refetch } = useProfile(accountId)

  const { theme } = useStyles()

  return (
    <SettingsMenu
      header={<ProfileCard profile={profile} />}
      items={[
        t('data.label'),
        ...UserFeedType.map((type) => ({
          arrow: true,
          icon: {
            color: theme.colors[colors[type]].a9,
            name: icons[type],
          },
          label: t(`data.${type}`),
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
        })),
        null,
        t('settings.label'),
        {
          arrow: true,
          icon: {
            name: 'GearSix',
            weight: 'duotone',
          },
          label: t('settings.settings'),
          onPress() {
            router.navigate({
              pathname: '/settings',
            })
          },
        },
      ]}
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
