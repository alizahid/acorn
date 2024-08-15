import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { type StyleProp, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { isUser, removePrefix } from '~/lib/reddit'
import { type Community } from '~/types/community'

import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'
import { Text } from '../common/text'

type Props = {
  community: Community
  style?: StyleProp<ViewStyle>
}

export function CommunityCard({ community, style }: Props) {
  const router = useRouter()

  const { styles, theme } = useStyles(stylesheet)

  return (
    <Pressable
      onPress={() => {
        if (isUser(community.name)) {
          router.navigate(`/users/${removePrefix(community.name)}/submitted`)
        } else {
          router.navigate(`/communities/${community.name}`)
        }
      }}
      style={[styles.main, style]}
    >
      <Image
        recyclingKey={community.id}
        source={community.image}
        style={styles.image}
      />

      <Text style={styles.name} weight="medium">
        {community.name}
      </Text>

      <Icon
        color={theme.colors.gray.a9}
        name="CaretRight"
        size={theme.space[4]}
      />
    </Pressable>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  image: {
    backgroundColor: theme.colors.gray.a3,
    borderCurve: 'continuous',
    borderRadius: theme.space[7],
    height: theme.space[7],
    width: theme.space[7],
  },
  main: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.space[4],
    paddingHorizontal: theme.space[4],
  },
  name: {
    flex: 1,
    marginVertical: theme.space[4],
  },
}))
