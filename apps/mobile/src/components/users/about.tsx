import { Image } from 'expo-image'
import { View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { useImagePlaceholder } from '~/hooks/image'
import { useListProps } from '~/hooks/list'
import { useFollow } from '~/hooks/mutations/users/follow'
import { useProfile } from '~/hooks/queries/user/profile'
import { space } from '~/styles/tokens'

import { Button } from '../common/button'
import { Icon } from '../common/icon'
import { Loading } from '../common/loading'
import { RefreshControl } from '../common/refresh-control'
import { Text } from '../common/text'
import { ProfileCard } from './profile'

type Props = {
  name: string
}

export function UserAbout({ name }: Props) {
  const t = useTranslations('component.users.about')

  const { profile, refetch } = useProfile(name)

  const { follow, isPending } = useFollow()

  const placeholder = useImagePlaceholder()

  const listProps = useListProps({
    extraBottom: space[4],
    extraTop: space[4],
    flash: false,
  })

  if (!profile) {
    return <Loading />
  }

  return (
    <ScrollView
      {...listProps}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl onRefresh={refetch} />}
    >
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
          loading={isPending}
          onPress={() => {
            follow({
              action: profile.subscribed ? 'unfollow' : 'follow',
              id: profile.subreddit,
              name: profile.name,
            })
          }}
          style={styles.button}
        />

        <View style={styles.button} />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create((theme) => ({
  banner: {
    aspectRatio: 1280 / 384,
    backgroundColor: theme.colors.gray.ui,
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
