import { Image } from 'expo-image'
import { ScrollView } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { useImagePlaceholder } from '~/hooks/image'
import { type ListProps } from '~/hooks/list'
import { useFollow } from '~/hooks/mutations/users/follow'
import { useProfile } from '~/hooks/queries/user/profile'
import { iPad } from '~/lib/common'

import { Button } from '../common/button'
import { Loading } from '../common/loading'
import { Markdown } from '../common/markdown'
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

  const { styles } = useStyles(stylesheet)

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
        <Markdown
          recyclingKey={profile.id}
          size="2"
          style={styles.description}
          variant="post"
        >
          {profile.description}
        </Markdown>
      ) : null}

      <View direction="row" gap="4" mx="4">
        <Button
          color={profile.subscribed ? 'red' : 'accent'}
          icon={{
            name: profile.subscribed ? 'UserCircleMinus' : 'UserCirclePlus',
          }}
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

const stylesheet = createStyleSheet((theme) => ({
  banner: {
    aspectRatio: 1280 / 384,
    backgroundColor: theme.colors.gray.ui,
  },
  button: {
    flex: 1,
  },
  content: {
    gap: theme.space[4],
    padding: iPad ? theme.space[4] : 0,
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
