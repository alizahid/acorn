import { useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { type SFSymbol } from 'expo-symbols'
import { useEffect } from 'react'
import { StyleSheet } from 'react-native-unistyles'
import { useFormatter, useTranslations } from 'use-intl'

import { Button } from '~/components/common/button'
import { Icon } from '~/components/common/icon'
import { Logo } from '~/components/common/logo'
import { Spinner } from '~/components/common/spinner'
import { Text } from '~/components/common/text'
import { View } from '~/components/common/view'
import { usePlan } from '~/hooks/purchases/plan'
import { useRestore } from '~/hooks/purchases/restore'
import { useSubscribe } from '~/hooks/purchases/subscribe'
import { useSubscribed } from '~/hooks/purchases/subscribed'
import { glass, iPhone } from '~/lib/common'
import { fonts } from '~/lib/fonts'

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
  }, [router.dismiss, subscribed])

  return (
    <View flex={1}>
      {iPhone && !glass ? <StatusBar style="light" /> : null}

      <View flex={1} gap="8" justify="center">
        <View align="center" gap="4">
          <Logo />

          <Text accent color="accent" size="8" weight="bold">
            {t('title')}
          </Text>
        </View>

        <View align="center" justify="center" style={styles.price}>
          {plan ? (
            <>
              <Text
                mt="2"
                size="9"
                style={{
                  fontFamily: fonts.apercu,
                }}
                tabular
                weight="bold"
              >
                {f.number(plan.product.price, {
                  currency: plan.product.currencyCode,
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

        <View gap="4" px="8">
          {([1, 2, 3, 4, 5, 6] as const).map((key) => (
            <View direction="row" gap="4" key={key}>
              <Icon name={icons[key]} />

              <View flex={1}>
                <Text weight="medium">{t(`feature.${key}`)}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View gap="4" mx="6" style={styles.footer}>
        <Button
          label={t('subscribe')}
          loading={subscribing}
          onPress={() => {
            subscribe()
          }}
        />

        <Button
          color="blue"
          label={t('restore')}
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
  features: {
    width: '100%',
  },
  footer: {
    marginBottom: theme.space[6] + runtime.insets.bottom,
  },
  price: {
    backgroundColor: theme.colors.accent.ui,
    height: theme.space[9] * 2,
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
