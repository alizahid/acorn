import { useRouter } from 'expo-router'
import { FlatList, View } from 'react-native'
import CaretRightIcon from 'react-native-phosphor/src/bold/CaretRight'
import DoorIcon from 'react-native-phosphor/src/duotone/Door'
import FingerprintIcon from 'react-native-phosphor/src/duotone/Fingerprint'
import UserCircleIcon from 'react-native-phosphor/src/duotone/UserCircle'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Pressable } from '~/components/common/pressable'
import { Text } from '~/components/common/text'
import { signOut } from '~/lib/auth'

export default function Screen() {
  const router = useRouter()

  const t = useTranslations('screen.settings')

  const { styles, theme } = useStyles(stylesheet)

  const menu = [
    {
      color: 'gray',
      href: '/auth/profile',
      icon: UserCircleIcon,
      key: 'profile',
    },
    {
      color: 'gray',
      href: '/auth/credentials',
      icon: FingerprintIcon,
      key: 'credentials',
    },
    'separator-1',
    {
      color: 'red',
      icon: DoorIcon,
      key: 'signOut',
      onPress: async () => {
        await signOut()
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

        const Icon = item.icon

        return (
          <Pressable
            onPress={() => {
              if ('href' in item) {
                router.navigate(item.href)
              }

              if ('onPress' in item) {
                void item.onPress()
              }
            }}
            style={styles.item}
          >
            <Icon
              color={
                theme.colors[`${item.color}A`][item.color === 'gray' ? 12 : 11]
              }
              size={theme.typography[3].lineHeight}
            />

            <Text color={item.color} style={styles.label}>
              {t(`menu.${item.key}`)}
            </Text>

            {'href' in item ? (
              <CaretRightIcon
                color={theme.colors.grayA[9]}
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
    gap: theme.space[2],
    padding: theme.space[3],
  },
  label: {
    flex: 1,
  },
  separator: {
    height: theme.space[6],
  },
}))
