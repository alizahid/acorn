import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { type StyleProp, type ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { removePrefix } from '~/lib/reddit'
import { type User } from '~/types/user'

import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'
import { Text } from '../common/text'

type Props = {
  style?: StyleProp<ViewStyle>
  user: User
}

export function UserCard({ style, user }: Props) {
  const router = useRouter()

  return (
    <Pressable
      align="center"
      direction="row"
      gap="4"
      label={user.name}
      onPress={() => {
        router.push({
          params: {
            name: removePrefix(user.name),
          },
          pathname: '/users/[name]',
        })
      }}
      px="4"
      style={style}
    >
      <Image
        accessibilityIgnoresInvertColors
        recyclingKey={user.id}
        source={user.image}
        style={styles.image}
      />

      <Text my="4" style={styles.name} weight="medium">
        {user.name}
      </Text>

      <Icon
        name="chevron.right"
        uniProps={(theme) => ({
          size: theme.space[4],
          tintColor: theme.colors.gray.accent,
        })}
      />
    </Pressable>
  )
}

const styles = StyleSheet.create((theme) => ({
  image: {
    backgroundColor: theme.colors.gray.ui,
    borderCurve: 'continuous',
    borderRadius: theme.space[7],
    height: theme.space[7],
    width: theme.space[7],
  },
  name: {
    flex: 1,
  },
}))
