import { useFocusEffect, useNavigation, useRouter } from 'expo-router'
import { FlatList, View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useFormatter, useTranslations } from 'use-intl'

import { Icon, type IconName } from '~/components/common/icon'
import { Pressable } from '~/components/common/pressable'
import { RefreshControl } from '~/components/common/refresh-control'
import { Text } from '~/components/common/text'
import { UserFeedType } from '~/hooks/queries/posts/posts'
import { useProfile } from '~/hooks/queries/user/profile'

export default function Screen() {
  const router = useRouter()
  const navigation = useNavigation()

  const t = useTranslations('screen.user.index')
  const f = useFormatter()

  const { styles, theme } = useStyles(stylesheet)

  const { profile, refetch } = useProfile()

  useFocusEffect(() => {
    if (!profile) {
      return
    }

    navigation.setOptions({
      title: profile.name,
    })
  })

  const header = [
    {
      key: 'karma',
      value: f.number(profile?.karma.total ?? 0, {
        notation: 'compact',
      }),
    },
    {
      key: 'post',
      value: f.number(profile?.karma.post ?? 0, {
        notation: 'compact',
      }),
    },
    {
      key: 'comment',
      value: f.number(profile?.karma.comment ?? 0, {
        notation: 'compact',
      }),
    },
    {
      key: 'joined',
      value: f.relativeTime(profile?.createdAt ?? new Date(), {
        style: 'narrow',
      }),
    },
  ] as const

  return (
    <FlatList
      ListHeaderComponent={
        <View style={styles.header}>
          {header.map((item) => (
            <View key={item.key} style={styles.badge}>
              <Text
                align="center"
                highContrast={false}
                size="1"
                weight="medium"
              >
                {t(`header.${item.key}`)}
              </Text>

              <Text align="center" tabular weight="bold">
                {item.value}
              </Text>
            </View>
          ))}
        </View>
      }
      data={UserFeedType}
      keyExtractor={(item) => item}
      refreshControl={<RefreshControl onRefresh={refetch} />}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => {
            if (!profile) {
              return
            }

            router.navigate(`/user/${item}?user=${profile.name}`)
          }}
          style={styles.item}
        >
          <Icon
            color={theme.colors.accent.a11}
            name={icons[item]}
            size={theme.space[5]}
            weight="duotone"
          />

          <Text style={styles.label} weight="medium">
            {t(`menu.${item}`)}
          </Text>

          <Icon
            color={theme.colors.gray.a9}
            name="CaretRight"
            size={theme.space[4]}
          />
        </Pressable>
      )}
    />
  )
}

const stylesheet = createStyleSheet((theme) => ({
  badge: {
    gap: theme.space[1],
  },
  header: {
    flexDirection: 'row',
    gap: theme.space[6],
    justifyContent: 'center',
    padding: theme.space[4],
  },
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
}))

const icons: Record<UserFeedType, IconName> = {
  comments: 'ChatCircleText',
  downvoted: 'ArrowFatDown',
  saved: 'BookmarkSimple',
  submitted: 'PaperPlaneTilt',
  upvoted: 'ArrowFatUp',
}
