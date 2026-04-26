import { useRouter } from 'expo-router'
import { type SFSymbol } from 'expo-symbols'
import { useEffect } from 'react'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useFormatter, useTranslations } from 'use-intl'

import { Button } from '~/components/common/button'
import { Icon } from '~/components/common/icon'
import { Logo } from '~/components/common/logo'
import { Spinner } from '~/components/common/spinner'
import { Text } from '~/components/common/text'
import { usePlan } from '~/hooks/purchases/plan'
import { useRestore } from '~/hooks/purchases/restore'
import { useSubscribe } from '~/hooks/purchases/subscribe'
import { useSubscribed } from '~/hooks/purchases/subscribed'
import { iPad } from '~/lib/common'

export default function Screen() {
  const router = useRouter()

  const t = useTranslations('screen.auth.subscribe')
  const f = useFormatter()

  const { subscribed } = useSubscribed()
  const { plan } = usePlan()

  const { restore, isPending: restoring } = useRestore()
  const { subscribe, isPending: subscribing } = useSubscribe()

  useEffect(() => {
    if (subscribed) {
      router.dismiss()
    }
  }, [subscribed, router])

  return (
    <View style={styles.main}>
      <View style={styles.header}>
        <Logo />
      </View>

      <View style={styles.price}>
        {plan ? (
          <>
            <Text mt="1" size="7" tabular weight="bold">
              {f.number(plan.price ?? 0, {
                currency: plan.currency,
                currencyDisplay: 'code',
                style: 'currency',
              })}
            </Text>

            <Text highContrast={false} weight="medium">
              {t('price.description')}
            </Text>
          </>
        ) : (
          <Spinner />
        )}
      </View>

      <View style={styles.features}>
        {([1, 2, 3, 4, 5, 6] as const).map((key) => (
          <View key={key} style={styles.feature}>
            <Icon
              name={icons[key]}
              uniProps={(theme) => ({
                tintColor: theme.colors.orange.accent,
              })}
            />

            <Text style={styles.label} weight="medium">
              {t(`feature.${key}`)}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Button
          color="orange"
          disabled={!plan}
          label={t(
            plan?.subscriptionOffers?.length
              ? 'footer.trial'
              : 'footer.subscribe',
          )}
          loading={subscribing}
          onPress={() => {
            if (!plan) {
              return
            }

            subscribe({
              plan,
            })
          }}
        />

        <Button
          color="blue"
          label={t('footer.restore')}
          loading={restoring}
          onPress={() => {
            restore()
          }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create((theme, runtime) => ({
  feature: {
    flexDirection: 'row',
    gap: theme.space[4],
  },
  features: {
    gap: theme.space[4],
    marginHorizontal: theme.space[iPad ? 8 : 4],
  },
  footer: {
    gap: theme.space[4],
    marginHorizontal: theme.space[iPad ? 8 : 4],
  },
  header: {
    alignItems: 'center',
    gap: theme.space[4],
    marginHorizontal: theme.space[iPad ? 8 : 4],
  },
  label: {
    flex: 1,
  },
  main: {
    flex: 1,
    gap: theme.space[8],
    justifyContent: 'center',
    marginBottom: runtime.insets.bottom,
    paddingVertical: theme.space[8],
  },
  price: {
    alignItems: 'center',
    backgroundColor: theme.colors.orange.ui,
    height: theme.space[8] * 2,
    justifyContent: 'center',
  },
  section: {
    flex: 1,
    gap: theme.space[4],
  },
  subscribe: {
    alignSelf: 'center',
  },
}))

const icons = {
  1: 'infinity',
  2: 'swatchpalette',
  3: 'nosign',
  4: 'lock',
  5: 'figure.run',
  6: 'theatermask.and.paintbrush',
} as const satisfies Record<number, SFSymbol>
