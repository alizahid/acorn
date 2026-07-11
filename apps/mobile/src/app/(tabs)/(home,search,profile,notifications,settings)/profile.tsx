import { useRouter } from 'expo-router'
import { ScrollView } from 'react-native-gesture-handler'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { FloatingButton } from '~/components/common/floating-button'
import { Icon, type IconName } from '~/components/common/icon'
import { Menu } from '~/components/common/menu'
import { RefreshControl } from '~/components/common/refresh-control'
import { ProfileCard } from '~/components/users/profile'
import { useListProps } from '~/hooks/list'
import { useProfile } from '~/hooks/queries/user/profile'
import { heights } from '~/lib/common'
import { removePrefix } from '~/lib/reddit'
import { useAuth } from '~/stores/auth'
import { type ColorToken, space } from '~/styles/tokens'
import { UserFeedType } from '~/types/user'

export default function Screen() {
  const router = useRouter()

  const t = useTranslations('screen.profile')
  const a11y = useTranslations('a11y')

  const { accountId } = useAuth(['accountId'])
  const { profile, refetch } = useProfile(accountId)

  const listProps = useListProps({
    extraBottom: heights.floatingButton,
    extraTop: space[4],
  })

  return (
    <>
      <ScrollView
        {...listProps}
        refreshControl={<RefreshControl onRefresh={refetch} />}
      >
        <Menu.Root style={styles.main}>
          <ProfileCard profile={profile} />

          {UserFeedType.map((type) => (
            <Menu.Button
              arrow
              icon={
                <Icon
                  name={icons[type]}
                  uniProps={(theme) => ({
                    color: theme.colors[colors[type]].accent,
                  })}
                />
              }
              key={type}
              label={t(type)}
              onPress={() => {
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
              }}
            />
          ))}
        </Menu.Root>
      </ScrollView>

      {profile ? (
        <FloatingButton
          label={a11y('createPost')}
          onPress={() => {
            router.navigate({
              params: {
                name: `u_${profile.name}`,
              },
              pathname: '/posts/new',
            })
          }}
        >
          <Icon name="plus-bold" />
        </FloatingButton>
      ) : null}
    </>
  )
}

const styles = StyleSheet.create({
  main: {
    paddingVertical: 0,
  },
})

const icons = {
  comments: 'chat-centered',
  downvoted: 'arrow-fat-down',
  hidden: 'eye-slash',
  saved: 'bookmark-simple',
  submitted: 'paper-plane-tilt',
  upvoted: 'arrow-fat-up',
} as const satisfies Record<UserFeedType, IconName>

const colors = {
  comments: 'accent',
  downvoted: 'violet',
  hidden: 'gray',
  saved: 'green',
  submitted: 'accent',
  upvoted: 'orange',
} as const satisfies Record<UserFeedType, ColorToken>
