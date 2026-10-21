import { useRouter } from 'expo-router'
import { type ReactNode, type RefObject } from 'react'
import { StyleSheet } from 'react-native-unistyles'

import { useSubscribed } from '~/hooks/purchases/subscribed'

import { Pressable } from '../pressable'
import { type Sheet } from '../sheet'

type Props = {
  sheet?: RefObject<Sheet | null>
  render: (disabled: boolean) => ReactNode
}

export function Paywall({ render, sheet }: Props) {
  const router = useRouter()

  const { subscribed } = useSubscribed()

  styles.useVariants({
    disabled: !subscribed,
  })

  return (
    <Pressable
      disabled={subscribed}
      onPress={async () => {
        await sheet?.current?.dismiss()

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
