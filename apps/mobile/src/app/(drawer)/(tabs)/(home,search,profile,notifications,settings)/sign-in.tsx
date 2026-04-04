import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import { ClientId } from '~/components/auth/client-id'
import { Button } from '~/components/common/button'
import { Logo } from '~/components/common/logo'
import { Text } from '~/components/common/text'
import { useSignIn } from '~/hooks/mutations/auth/sign-in'
import { useClientId } from '~/hooks/purchases/client-id'
import { useSubscribed } from '~/hooks/purchases/subscribed'
import { testFlight } from '~/lib/common'

const schema = z.object({
  mode: z.enum(['dismissible', 'fixed']).catch('fixed'),
})

export type SignInParams = z.infer<typeof schema>

export default function Screen() {
  const t = useTranslations('screen.auth.signIn')

  const { isPending, signIn } = useSignIn()
  const { subscribed } = useSubscribed()
  const { clientId } = useClientId()

  return (
    <View style={styles.main}>
      <View style={styles.content}>
        <Logo />

        <Text mt="4" size="8" style={styles.title} weight="bold">
          {t('title')}
        </Text>

        <Text highContrast={false} mt="2" size="2" weight="medium">
          {t('description')}
        </Text>
      </View>

      <Button
        disabled={!(testFlight || subscribed) || (testFlight && !clientId)}
        label={t('signIn')}
        loading={isPending}
        onPress={() => {
          signIn()
        }}
      />

      {testFlight ? <ClientId /> : null}
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  content: {
    alignItems: 'center',
  },
  main: {
    alignItems: 'center',
    flex: 1,
    gap: theme.space[8],
    justifyContent: 'center',
  },
  title: {
    color: theme.colors.accent.accent,
  },
}))
