import { useRouter } from 'expo-router'
import { useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { type IconName } from '~/components/common/icon'
import { Menu, type MenuItem } from '~/components/common/menu'
import { ProfileCard } from '~/components/users/profile'
import { useList } from '~/hooks/list'
import { useProfile } from '~/hooks/queries/user/profile'
import { removePrefix } from '~/lib/reddit'
import { useAuth } from '~/stores/auth'
import { type ColorToken } from '~/styles/tokens'
import { UserFeedType } from '~/types/user'

export function ProfileScreen() {
  const router = useRouter()

  const t = useTranslations('screen.profile')

  const { accountId } = useAuth()
  const { profile, refetch } = useProfile(accountId)

  const { theme } = useStyles()

  const listProps = useList()

  return (
    <Menu
      header={<ProfileCard profile={profile} />}
      items={[
        ...UserFeedType.map<MenuItem>((type) => ({
          arrow: true,
          icon: {
            color: theme.colors[colors[type]].a9,
            name: icons[type],
            type: 'icon',
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
        t('settings.title'),
        {
          arrow: true,
          icon: {
            name: 'GearSix',
            type: 'icon',
            weight: 'duotone',
          },
          label: t('settings.preferences'),
          onPress() {
            router.navigate({
              pathname: '/settings/preferences',
            })
          },
        },
        {
          arrow: true,
          icon: {
            name: 'SlidersHorizontal',
            type: 'icon',
            weight: 'duotone',
          },
          label: t('settings.defaults'),
          onPress() {
            router.navigate({
              pathname: '/settings/defaults',
            })
          },
        },
        {
          arrow: true,
          icon: {
            name: 'HandSwipeLeft',
            type: 'icon',
            weight: 'duotone',
          },
          label: t('settings.gestures'),
          onPress() {
            router.navigate({
              pathname: '/settings/gestures',
            })
          },
        },
        {
          arrow: true,
          icon: {
            name: 'Palette',
            type: 'icon',
            weight: 'duotone',
          },
          label: t('settings.themes'),
          onPress() {
            router.navigate({
              pathname: '/settings/themes',
            })
          },
        },
        {
          arrow: true,
          icon: {
            name: 'SortAscending',
            type: 'icon',
            weight: 'duotone',
          },
          label: t('settings.sort'),
          onPress() {
            router.navigate({
              pathname: '/settings/sort',
            })
          },
        },
        {
          arrow: true,
          icon: {
            name: 'HardDrives',
            type: 'icon',
            weight: 'duotone',
          },
          label: t('settings.cache'),
          onPress() {
            router.navigate({
              pathname: '/settings/cache',
            })
          },
        },
        {
          arrow: true,
          icon: {
            name: 'Info',
            type: 'icon',
            weight: 'duotone',
          },
          label: t('settings.about'),
          onPress() {
            router.navigate({
              pathname: '/settings/about',
            })
          },
        },
      ]}
      listProps={listProps}
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
  comments: 'accent',
  downvoted: 'violet',
  hidden: 'gray',
  saved: 'green',
  submitted: 'accent',
  upvoted: 'orange',
}
