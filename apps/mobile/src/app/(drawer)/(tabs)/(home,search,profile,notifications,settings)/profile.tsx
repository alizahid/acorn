import { useRouter } from 'expo-router'
import { type SFSymbol } from 'expo-symbols'
import { ScrollView } from 'react-native'
import { useTranslations } from 'use-intl'

import { FloatingButton } from '~/components/common/floating-button'
import { Icon } from '~/components/common/icon'
import { Menu } from '~/components/common/menu'
import { RefreshControl } from '~/components/common/refresh-control'
import { ProfileCard } from '~/components/users/profile'
import { useList } from '~/hooks/list'
import { useProfile } from '~/hooks/queries/user/profile'
import { getIcon } from '~/lib/icons'
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

  const listProps = useList()

  return (
    <>
      <ScrollView
        {...listProps}
        refreshControl={<RefreshControl onRefresh={refetch} />}
      >
        <Menu.Root py="0">
          <ProfileCard profile={profile} />

          {UserFeedType.map((type) => (
            <Menu.Button
              arrow
              icon={
                <Icon
                  name={icons[type]}
                  uniProps={(theme) => ({
                    tintColor: theme.colors[colors[type]].accent,
                  })}
                />
              }
              key={type}
              label={t(type)}
              onPress={() => {
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
              }}
            />
          ))}
        </Menu.Root>
      </ScrollView>

      {profile ? (
        <FloatingButton
          icon="plus"
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

const icons = {
  comments: 'bubble.left',
  downvoted: getIcon('downvote'),
  hidden: 'eye.slash',
  saved: 'bookmark',
  submitted: 'paperplane',
  upvoted: getIcon('upvote'),
} as const satisfies Record<UserFeedType, SFSymbol>

const colors = {
  comments: 'accent',
  downvoted: 'violet',
  hidden: 'gray',
  saved: 'green',
  submitted: 'accent',
  upvoted: 'orange',
} as const satisfies Record<UserFeedType, ColorToken>
