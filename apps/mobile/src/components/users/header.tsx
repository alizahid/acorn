import { type NativeStackHeaderProps } from '@react-navigation/native-stack'
import { type SharedValue } from 'react-native-reanimated'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { useFollow } from '~/hooks/mutations/users/follow'
import { useProfile } from '~/hooks/queries/user/profile'
import { UserTab } from '~/types/user'

import { SegmentedControl } from '../common/segmented-control'
import { Text } from '../common/text'
import { View } from '../common/view'
import { HeaderButton } from '../navigation/header-button'

type Props = NativeStackHeaderProps & {
  offset: SharedValue<number>
  onChange: (index: number) => void
  username: string
}

export function UserHeader({ navigation, offset, onChange, username }: Props) {
  const t = useTranslations('component.users.header')

  const { styles } = useStyles(stylesheet)

  const { profile } = useProfile(username)
  const { follow, isPending } = useFollow()

  return (
    <View style={styles.main}>
      <View align="center" direction="row" height="8" justify="center">
        <HeaderButton
          icon="ArrowLeft"
          onPress={() => {
            navigation.goBack()
          }}
          style={styles.back}
          weight="bold"
        />

        <Text lines={1} style={styles.title} weight="bold">
          {profile?.name}
        </Text>

        {profile ? (
          <HeaderButton
            color={profile.subscribed ? 'red' : 'accent'}
            icon={profile.subscribed ? 'UserCircleMinus' : 'UserCirclePlus'}
            loading={isPending}
            onPress={() => {
              follow({
                action: profile.subscribed ? 'unfollow' : 'follow',
                id: profile.subreddit,
                name: profile.name,
              })
            }}
            style={styles.follow}
          />
        ) : null}
      </View>

      <SegmentedControl
        items={UserTab.map((tab) => t(tab))}
        offset={offset}
        onChange={onChange}
      />
    </View>
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  back: {
    left: 0,
    position: 'absolute',
    top: 0,
  },
  follow: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  main: {
    backgroundColor: theme.colors.gray[1],
    paddingTop: runtime.insets.top,
  },
  title: {
    maxWidth: '60%',
  },
}))
