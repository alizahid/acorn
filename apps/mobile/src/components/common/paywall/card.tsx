import { useRouter } from 'expo-router'
import { type StyleProp, type ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { useSubscribed } from '~/hooks/purchases/subscribed'

import { Icon } from '../icon'
import { Logo } from '../logo'
import { Pressable } from '../pressable'
import { Text } from '../text'

type Props = {
  style?: StyleProp<ViewStyle>
}

export function PaywallCard({ style }: Props) {
  const router = useRouter()

  const t = useTranslations('component.common.paywall.card')

  const { subscribed } = useSubscribed()

  if (subscribed) {
    return null
  }

  return (
    <Pressable
      onPress={() => {
        router.navigate('/subscribe')
      }}
      style={[styles.main, style]}
    >
      <Logo style={styles.logo} />

      <Text color="accent" contrast size="2" style={styles.label} weight="bold">
        {t('title')}
      </Text>

      <Icon
        name="caret-right"
        uniProps={(theme) => ({
          color: theme.colors.accent.contrast,
          size: theme.typography[2].lineHeight,
        })}
      />
    </Pressable>
  )
}

const styles = StyleSheet.create((theme) => ({
  label: {
    flex: 1,
  },
  logo: {
    height: theme.typography[2].lineHeight,
    width: theme.typography[2].lineHeight,
  },
  main: {
    backgroundColor: theme.colors.accent.accent,
    flexDirection: 'row',
    gap: theme.space[3],
    padding: theme.space[3],
  },
}))
