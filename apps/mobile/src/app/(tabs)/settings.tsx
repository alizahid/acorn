import { useRouter } from 'expo-router'
import { FlatList, View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Icon, type IconName } from '~/components/common/icon'
import { Pressable } from '~/components/common/pressable'
import { Text } from '~/components/common/text'
import { useSignOut } from '~/hooks/mutations/auth/sign-out'

export default function Screen() {
  const router = useRouter()

  const t = useTranslations('screen.settings')

  const { signOut } = useSignOut()

  const { styles, theme } = useStyles(stylesheet)

  const menu = [
    {
      color: 'gray',
      href: '/settings',
      icon: 'UserCircle' satisfies IconName,
      key: 'profile',
    },
    {
      color: 'gray',
      href: '/settings',
      icon: 'FingerprintSimple' satisfies IconName,
      key: 'credentials',
    },
    'separator-1',
    {
      color: 'red',
      icon: 'Door' satisfies IconName,
      key: 'signOut',
      onPress: () => {
        signOut()
      },
    },
  ] as const

  return (
    <FlatList
      data={menu}
      keyExtractor={(item) => (typeof item === 'string' ? item : item.key)}
      renderItem={({ item }) => {
        if (typeof item === 'string') {
          return <View style={styles.separator} />
        }

        return (
          <Pressable
            onPress={() => {
              if ('href' in item) {
                router.navigate(item.href)
              }

              if ('onPress' in item) {
                item.onPress()
              }
            }}
            style={styles.item}
          >
            <Icon
              color={
                theme.colors[item.color][item.color === 'gray' ? 'a12' : 'a11']
              }
              name={item.icon}
              size={theme.space[5]}
            />

            <Text color={item.color} style={styles.label} weight="medium">
              {t(`menu.${item.key}`)}
            </Text>

            {'href' in item ? (
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
  separator: {
    height: theme.space[6],
  },
}))
