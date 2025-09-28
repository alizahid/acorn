import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { type StyleProp, type ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useFormatter, useTranslations } from 'use-intl'

import { removePrefix } from '~/lib/reddit'
import { type Community } from '~/types/community'

import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { View } from '../common/view'

type Props = {
  community: Community
  style?: StyleProp<ViewStyle>
}

export function CommunityCard({ community, style }: Props) {
  const router = useRouter()

  const a11y = useTranslations('a11y')
  const f = useFormatter()

  return (
    <Pressable
      accessibilityHint={a11y('viewCommunity')}
      accessibilityLabel={community.name}
      align="center"
      direction="row"
      gap="4"
      onPress={() => {
        if (community.user) {
          router.push({
            params: {
              name: removePrefix(community.name),
            },
            pathname: '/users/[name]',
          })

          return
        }

        router.push({
          params: {
            name: removePrefix(community.name),
          },
          pathname: '/communities/[name]',
        })
      }}
      px="4"
      style={style}
    >
      <Image
        accessibilityIgnoresInvertColors
        recyclingKey={community.id}
        source={community.image}
        style={styles.image}
      />

      <View align="center" direction="row" flex={1} gap="2" my="4">
        <Text weight="medium">{community.name}</Text>

        <Text highContrast={false} size="1" tabular>
          {f.number(community.subscribers, {
            notation: 'compact',
          })}
        </Text>
      </View>

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
