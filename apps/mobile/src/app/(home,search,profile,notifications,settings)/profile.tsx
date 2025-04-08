import { useRouter } from 'expo-router'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { FloatingButton } from '~/components/common/floating-button'
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
  const a11y = useTranslations('a11y')

  const { accountId } = useAuth()
  const { profile, refetch } = useProfile(accountId)

  const { styles, theme } = useStyles(stylesheet)

  const listProps = useList()

  return (
    <>
      <Menu
        header={<ProfileCard profile={profile} />}
        items={UserFeedType.map<MenuItem>((type) => ({
          arrow: true,
          icon: {
            color: theme.colors[colors[type]].accent,
            name: icons[type],
            type: 'icon',
          },
          label: t(type),
          onPress() {
            if (!profile) {
              return
            }

            router.push({
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
        style={styles.content}
      />

      {profile ? (
        <FloatingButton
          icon="Plus"
          label={a11y('createPost')}
          onPress={() => {
            router.push({
              params: {
                name: `u_${profile.name}`,
              },
              pathname: '/posts/new',
            })
          }}
        />
      ) : null}
    </>
  )
}

const stylesheet = createStyleSheet(() => ({
  content: {
    paddingVertical: 0,
  },
}))

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
