import { Image } from 'expo-image'
import { ScrollView } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { useImagePlaceholder } from '~/hooks/image'
import { type ListProps } from '~/hooks/list'
import { useFollow } from '~/hooks/mutations/users/follow'
import { useProfile } from '~/hooks/queries/user/profile'

import { Button } from '../common/button'
import { Html } from '../common/html'
import { Loading } from '../common/loading'
import { RefreshControl } from '../common/refresh-control'
import { Text } from '../common/text'
import { View } from '../common/view'
import { ProfileCard } from './profile'

type Props = {
  listProps?: ListProps
  name: string
}

export function UserAbout({ listProps, name }: Props) {
  const t = useTranslations('component.users.about')

  const { profile, refetch } = useProfile(name)

  const { follow } = useFollow()

  const placeholder = useImagePlaceholder()

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
        <View mb="-4">
          <Image
            {...placeholder}
            accessibilityIgnoresInvertColors
            source={profile.banner}
            style={styles.banner}
          />
        </View>
      ) : null}

      <View align="center" direction="row" gap="4" mt="4" mx="4">
        {profile.image ? (
          <Image
            accessibilityIgnoresInvertColors
            source={profile.image}
            style={styles.image}
          />
        ) : null}

        <View flex={1} gap="2">
          <Text size="6" weight="bold">
            r/{profile.name}
          </Text>
        </View>
      </View>

      <ProfileCard profile={profile} />

      {profile.description ? (
        <Html size="2" style={styles.description} type="about">
          {profile.description}
        </Html>
      ) : null}

      <View direction="row" gap="4" mx="4">
        <Button
          color={profile.subscribed ? 'red' : 'accent'}
          icon={
            profile.subscribed
              ? 'person.crop.circle.badge.minus'
              : 'person.crop.circle.badge.plus'
          }
          label={t(profile.subscribed ? 'unfollow' : 'follow')}
          onPress={() => {
            follow({
              action: profile.subscribed ? 'unfollow' : 'follow',
              id: profile.subreddit,
              name: profile.name,
            })
          }}
          style={styles.button}
        />

        <View flex={1} />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create((theme) => ({
  banner: {
    aspectRatio: 1280 / 384,
    backgroundColor: theme.colors.gray.ui,
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
}))
