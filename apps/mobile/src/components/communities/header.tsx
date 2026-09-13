import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { type ReactNode } from 'react'
import { PlatformColor } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { removePrefix } from '~/lib/reddit'

import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { GlassView } from '../native/glass-view'

type Props = {
  disabled?: boolean
  image?: ReactNode
  name: string
  type?: 'community' | 'feed' | 'user'
}

export function CommunityHeader({
  disabled = false,
  image,
  name,
  type = 'community',
}: Props) {
  const router = useRouter()

  const a11y = useTranslations('a11y')

  return (
    <GlassView isInteractive={!disabled} style={styles.main}>
      <Pressable
        accessibilityHint={a11y('viewCommunity')}
        accessibilityLabel={name}
        disabled={disabled}
        onPress={() => {
          if (type === 'feed') {
            router.navigate({
              params: {
                feed: removePrefix(name),
              },
              pathname: '/',
            })

            return
          }

          if (type === 'user' || name.startsWith('u/')) {
            router.navigate({
              params: {
                name: removePrefix(name),
              },
              pathname: '/users/[name]',
            })

            return
          }

          router.navigate({
            params: {
              name: removePrefix(name),
            },
            pathname: '/communities/[name]',
          })
        }}
        style={styles.content}
      >
        {typeof image === 'string' ? (
          <Image source={image} style={styles.image} />
        ) : (
          image
        )}

        <Text numberOfLines={1} style={styles.name} weight="bold">
          {name}
        </Text>
      </Pressable>
    </GlassView>
  )
}

const styles = StyleSheet.create((theme) => ({
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.space[2],
    height: 44,
    paddingHorizontal: theme.space[4],
  },
  image: {
    borderCurve: 'continuous',
    borderRadius: theme.typography[3].lineHeight,
    height: theme.typography[3].lineHeight,
    width: theme.typography[3].lineHeight,
  },
  main: {
    borderCurve: 'continuous',
    borderRadius: theme.space[8],
  },
  name: {
    color: PlatformColor('labelColor'),
    flexShrink: 1,
  },
}))
