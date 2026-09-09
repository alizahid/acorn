import { useRouter } from 'expo-router'
import { type ReactNode } from 'react'
import { StyleSheet } from 'react-native-unistyles'

import { useSubscribed } from '~/hooks/purchases/subscribed'

import { Pressable } from '../pressable'

type Props = {
  render: (disabled: boolean) => ReactNode
}

export function Paywall({ render }: Props) {
  const router = useRouter()

  const { subscribed } = useSubscribed()

  styles.useVariants({
    disabled: !subscribed,
  })

  return (
    <Pressable
      disabled={subscribed}
      onPress={() => {
        router.navigate('/subscribe')
      }}
      style={styles.main}
      variant="plain"
    >
      {render(!subscribed)}
    </Pressable>
  )
}

const styles = StyleSheet.create(() => ({
  main: {
    variants: {
      disabled: {
        true: {
          opacity: 0.5,
        },
      },
    },
  },
}))
