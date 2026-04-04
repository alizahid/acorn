import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { type StyleProp, View, type ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useFormatter, useTranslations } from 'use-intl'

import { removePrefix } from '~/lib/reddit'
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

  const a11y = useTranslations('a11y')
  const f = useFormatter()

  return (
    <Pressable
      accessibilityHint={a11y('viewCommunity')}
      accessibilityLabel={community.name}
      onPress={() => {
        if (community.user) {
          router.navigate({
            params: {
              name: removePrefix(community.name),
            },
            pathname: '/users/[name]',
          })

          return
        }

        router.navigate({
          params: {
            name: removePrefix(community.name),
          },
          pathname: '/communities/[name]',
        })
      }}
      style={[styles.main, style]}
    >
      <Image
        accessibilityIgnoresInvertColors
        recyclingKey={community.id}
        source={community.image}
        style={styles.image}
      />

      <View style={styles.content}>
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
  content: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: theme.space[2],
    marginVertical: theme.space[4],
  },
  image: {
    backgroundColor: theme.colors.gray.ui,
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
  },
}))
