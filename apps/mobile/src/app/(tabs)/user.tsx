import { default as Constants } from 'expo-constants'
import { useFocusEffect, useNavigation, useRouter } from 'expo-router'
import { FlatList, View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Icon, type IconName } from '~/components/common/icon'
import { Pressable } from '~/components/common/pressable'
import { RefreshControl } from '~/components/common/refresh-control'
import { Text } from '~/components/common/text'
import { ProfileCard } from '~/components/users/profile'
import { useCommon } from '~/hooks/common'
import { useProfile } from '~/hooks/queries/user/profile'
import { useAuth } from '~/stores/auth'
import { UserFeedType } from '~/types/user'

export default function Screen() {
  const router = useRouter()
  const navigation = useNavigation()

  const t = useTranslations('tab.user')

  const { styles, theme } = useStyles(stylesheet)

  const common = useCommon()

  const { accountId, clearCache } = useAuth()
  const { profile, refetch } = useProfile(accountId)

  useFocusEffect(() => {
    if (!profile) {
      return
    }

    navigation.setOptions({
      title: profile.name,
    })
  })

  const items = [
    ...UserFeedType.map((item) => ({
      arrow: true,
      icon: icons[item],
      key: item,
      label: t(`menu.${item}`),
      onPress() {
        if (!profile) {
          return
        }

        router.navigate(`/users/${profile.name}/${item}`)
      },
    })),
    'separator-1',
    {
      arrow: false,
      icon: 'HardDrives',
      key: 'cache',
      label: t('settings.cache'),
      onPress() {
        clearCache()
      },
    },
  ] as const

  return (
    <FlatList
      {...common.listProps({
        header: true,
        tabBar: true,
      })}
      ListFooterComponent={
        <Text code highContrast={false} size="1" style={styles.version}>
          v{Constants.expoConfig?.version ?? 0}
        </Text>
      }
      ListHeaderComponent={<ProfileCard profile={profile} />}
      contentContainerStyle={styles.main(
        common.height.header,
        common.height.tabBar,
      )}
      data={items}
      keyExtractor={(item) => (typeof item === 'string' ? item : item.key)}
      refreshControl={
        <RefreshControl offset={common.height.header} onRefresh={refetch} />
      }
      renderItem={({ item }) => {
        if (typeof item === 'string') {
          return <View style={styles.separator} />
        }

        return (
          <Pressable
            onPress={() => {
              item.onPress()
            }}
            style={styles.item}
          >
            <Icon
              color={theme.colors.accent.a11}
              name={item.icon}
              size={theme.space[5]}
              weight="duotone"
            />

            <Text style={styles.label} weight="medium">
              {item.label}
            </Text>

            {item.arrow ? (
              <Icon
                color={theme.colors.gray.a9}
                name="CaretRight"
                size={theme.space[4]}
              />
            ) : null}
          </Pressable>
        )
      }}
    />
  )
}

const stylesheet = createStyleSheet((theme) => ({
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.space[4],
    paddingHorizontal: theme.space[4],
  },
  label: {
    flex: 1,
    marginVertical: theme.space[4],
  },
  main: (top: number, bottom: number) => ({
    paddingBottom: bottom,
    paddingTop: top,
  }),
  separator: {
    height: theme.space[4],
  },
  version: {
    margin: theme.space[4],
    marginTop: theme.space[6],
  },
}))

const icons: Record<UserFeedType, IconName> = {
  comments: 'ChatCircleText',
  downvoted: 'ArrowFatDown',
  saved: 'BookmarkSimple',
  submitted: 'PaperPlaneTilt',
  upvoted: 'ArrowFatUp',
}
