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

export default function Screen() {
  const router = useRouter()

  const t = useTranslations('screen.profile')

  const { accountId } = useAuth()
  const { profile, refetch } = useProfile(accountId)

  const { theme } = useStyles()

  const listProps = useList()

  return (
    <Menu
      header={<ProfileCard profile={profile} />}
      items={UserFeedType.map<MenuItem>((type) => ({
        arrow: true,
        icon: {
          color: theme.colors[colors[type]].a9,
          name: icons[type],
          type: 'icon',
        },
        label: t(type),
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