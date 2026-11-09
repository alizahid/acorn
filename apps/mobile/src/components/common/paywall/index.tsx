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

  const variants = styles.useVariants({
    disabled: !subscribed,
  })

  if (subscribed) {
    return render(false)
  }

  return (
    <Pressable
      onPress={async () => {
        await sheet?.current?.dismiss()

        router.navigate('/subscribe')
      }}
      style={variants.main}
      variant="plain"
    >
      {render(true)}
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
