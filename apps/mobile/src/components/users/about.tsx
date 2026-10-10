import { Image } from 'expo-image'
import { Stack } from 'expo-router'
import { View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { useShallow } from 'zustand/react/shallow'

import { useImagePlaceholder } from '~/hooks/image'
import { useListProps } from '~/hooks/list'
import { useFavorite } from '~/hooks/mutations/users/favorite'
import { useFollow } from '~/hooks/mutations/users/follow'
import { useProfile } from '~/hooks/queries/user/profile'
import { iPad } from '~/lib/common'
import { useAuth } from '~/stores/auth'

import { Button } from '../common/button'
import { Icon } from '../common/icon'
import { Loading } from '../common/loading'
import { RefreshControl } from '../common/refresh-control'
import { Text } from '../common/text'
import { CommunityHeader } from '../communities/header'
import { ProfileCard } from './profile'

type Props = {
  name: string
}

export function UserAbout({ name }: Props) {
  const t = useTranslations('component.users.about')

  const { profile, refetch } = useProfile(name)

  const { accountId } = useAuth(
    useShallow((state) => ({
      accountId: state.accountId,
    })),
  )

  const { profile: user } = useProfile(accountId)

  const { follow, isPending: following } = useFollow()
  const { favorite, isPending: favoriting } = useFavorite()

  const placeholder = useImagePlaceholder()

  const listProps = useListProps()

  if (!profile) {
    return <Loading />
  }

  const { subreddit } = profile

  return (
    <ScrollView
      {...listProps}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl onRefresh={refetch} />}
    >
      <Stack.Title asChild>
        <CommunityHeader
          image={profile.image}
          name={profile.name}
          type="user"
        />
      </Stack.Title>

      {profile.banner ? (
        <Image
          {...placeholder}
          accessibilityIgnoresInvertColors
          source={profile.banner}
          style={styles.banner}
        />
      ) : null}

      <View style={styles.header}>
        {profile.image ? (
          <Image
            accessibilityIgnoresInvertColors
            source={profile.image}
            style={styles.image}
          />
        ) : null}

        <View style={styles.name}>
          <Text size="6" weight="bold">
            u/{profile.name}
          </Text>
        </View>
      </View>

      <ProfileCard profile={profile} />

      {profile.noFollow ? null : (
        <View style={styles.footer}>
          <Button
            color={profile.subscribed ? 'red' : 'accent'}
            label={t(profile.subscribed ? 'unfollow' : 'follow')}
            left={
              <Icon
                name={
                  profile.subscribed ? 'user-circle-minus' : 'user-circle-plus'
                }
                uniProps={(theme) => ({
                  color: theme.colors.accent.contrast,
                })}
              />
            }
            loading={following}
            onPress={() => {
              follow({
                action: profile.subscribed ? 'unfollow' : 'follow',
                id: profile.id,
                name: profile.name,
              })
            }}
            style={styles.button}
          />

          {/* Reddit only lets you favorite users you follow */}
          {user && subreddit && profile.subscribed ? (
            <Button
              color={profile.favorite ? 'amber' : 'gray'}
              label={t(profile.favorite ? 'unfavorite' : 'favorite')}
              left={
                <Icon
                  name={profile.favorite ? 'star-fill' : 'star'}
                  uniProps={(theme) => ({
                    color: profile.favorite
                      ? theme.colors.amber.contrast
                      : theme.colors.gray.contrast,
                  })}
                />
              }
              loading={favoriting}
              onPress={() => {
                favorite({
                  favorite: !profile.favorite,
                  id: subreddit,
                  name: profile.name,
                })
              }}
              style={styles.button}
            />
          ) : (
            <View style={styles.button} />
          )}
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create((theme) => ({
  banner: {
    backgroundColor: theme.colors.gray.ui,
    height: theme.space[9] * (iPad ? 3 : 1),
    marginBottom: -theme.space[4],
  },
  button: {
    flex: 1,
  },
  content: {
    gap: theme.space[4],
  },
  description: {
    marginHorizontal: theme.space[4],
  },
  footer: {
    flexDirection: 'row',
    gap: theme.space[4],
    marginHorizontal: theme.space[4],
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.space[4],
    marginHorizontal: theme.space[4],
    marginTop: theme.space[4],
  },
  image: {
    backgroundColor: theme.colors.gray.ui,
    borderCurve: 'continuous',
    borderRadius: theme.space[8],
    height: theme.space[8],
    width: theme.space[8],
  },
  info: {
    backgroundColor: theme.colors.accent.ui,
  },
  name: {
    flex: 1,
    gap: theme.space[2],
  },
}))
