import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import CaretRightIcon from 'react-native-phosphor/src/bold/CaretRight'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { type Community } from '~/types/community'

import { Pressable } from '../common/pressable'
import { Text } from '../common/text'

type Props = {
  community: Community
}

export function CommunityCard({ community }: Props) {
  const router = useRouter()

  const { styles, theme } = useStyles(stylesheet)

  return (
    <Pressable
      onPress={() => {
        router.navigate(`/communities/${community.name}`)
      }}
      style={styles.main}
    >
      <Image key={community.id} source={community.image} style={styles.image} />

      <Text style={styles.name} weight="medium">
        {community.name}
      </Text>

      <CaretRightIcon color={theme.colors.grayA[11]} size={theme.space[4]} />
    </Pressable>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  image: {
    backgroundColor: theme.colors.grayA[3],
    borderRadius: theme.space[6],
    height: theme.space[6],
    width: theme.space[6],
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
