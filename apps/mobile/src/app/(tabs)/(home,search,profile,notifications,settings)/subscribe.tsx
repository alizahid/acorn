import {
  type Product,
  type ProductOrSubscription,
  type ProductSubscription,
} from 'expo-iap'
import { useRouter } from 'expo-router'
import { orderBy } from 'lodash'
import { useEffect, useState } from 'react'
import { View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { StyleSheet } from 'react-native-unistyles'
import { useFormatter, useTranslations } from 'use-intl'

import { Button } from '~/components/common/button'
import { Icon, type IconName } from '~/components/common/icon'
import { Logo } from '~/components/common/logo'
import { Pressable } from '~/components/common/pressable'
import { Spinner } from '~/components/common/spinner'
import { Text } from '~/components/common/text'
import { usePlans } from '~/hooks/purchases/plans'
import { useRedeem } from '~/hooks/purchases/redeem'
import { useRestore } from '~/hooks/purchases/restore'
import { useSubscribe } from '~/hooks/purchases/subscribe'
import { useSubscribed } from '~/hooks/purchases/subscribed'

export default function Screen() {
  const router = useRouter()

  const t = useTranslations('screen.auth.subscribe')
  const f = useFormatter()

  const { subscribed } = useSubscribed()
  const { plans } = usePlans()

  const { restore, isPending: restoring } = useRestore()
  const { subscribe, isPending: subscribing } = useSubscribe()
  const { redeem, isPending: redeeming } = useRedeem()

  const [plan, setPlan] = useState<
    ProductOrSubscription | Product | ProductSubscription
  >()

  useEffect(() => {
    if (subscribed) {
      router.dismiss()
    }
  }, [subscribed, router])

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Logo />
      </View>

      {plans ? (
        <View>
          {orderBy(plans, 'price').map((item) => (
            <Pressable
              key={item.id}
              onPress={() => {
                setPlan(item)
              }}
              style={styles.plan(item.id === plan?.id)}
            >
              <Icon
                name={item.id === plan?.id ? 'check-circle-fill' : 'circle'}
                uniProps={(theme) => ({
                  color:
                    item.id === plan?.id
                      ? theme.colors.accent.contrast
                      : theme.colors.accent.accent,
                })}
              />

              <View style={styles.description}>
                <Text
                  contrast={item.id === plan?.id}
                  size="7"
                  tabular
                  weight="bold"
                >
                  {f.number(item.price ?? 0, {
                    currency: item.currency,
                    currencyDisplay: 'symbol',
                    style: 'currency',
                  })}
                </Text>

                <Text
                  contrast={item.id === plan?.id}
                  highContrast={false}
                  weight="medium"
                >
                  {item.title}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      ) : (
        <Spinner />
      )}

      <View style={styles.features}>
        {([1, 2, 3, 4, 5, 6, 7] as const).map((key) => (
          <View key={key} style={styles.feature}>
            <Icon
              name={icons[key]}
              uniProps={(theme) => ({
                color: theme.colors.orange.accent,
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
            plan?.id === 'lifetime'
              ? 'footer.buy'
              : plan?.subscriptionOffers?.length
                ? 'footer.trial'
                : 'footer.subscribe',
          )}
          loading={subscribing}
          onPress={() => {
            if (!plan) {
              return
            }

            subscribe({
              planId: plan.id,
            })
          }}
        />

        <View style={styles.feature}>
          <Button
            color="blue"
            label={t('footer.restore')}
            loading={restoring}
            onPress={() => {
              restore()
            }}
            style={styles.button}
          />

          <Button
            color="plum"
            label={t('footer.redeem')}
            loading={redeeming}
            onPress={() => {
              redeem()
            }}
            style={styles.button}
          />
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create((theme, runtime) => ({
  button: {
    flex: 1,
  },
  content: {
    gap: theme.space[8],
    paddingBottom: runtime.insets.bottom + theme.space[4],
    paddingTop: theme.space[8],
  },
  description: {
    flex: 1,
  },
  feature: {
    flexDirection: 'row',
    gap: theme.space[4],
  },
  features: {
    gap: theme.space[4],
    marginHorizontal: theme.space[4],
  },
  footer: {
    gap: theme.space[4],
    marginHorizontal: theme.space[4],
  },
  header: {
    alignItems: 'center',
    gap: theme.space[4],
    marginHorizontal: theme.space[4],
  },
  label: {
    flex: 1,
  },
  plan: (selected: boolean) => ({
    alignItems: 'center',
    backgroundColor: selected ? theme.colors.accent.accent : undefined,
    flexDirection: 'row',
    gap: theme.space[4],
    justifyContent: 'center',
    padding: theme.space[4],
  }),
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
  2: 'list-checks',
  3: 'palette',
  4: 'broadcast',
  5: 'lock',
  6: 'person-simple-run',
  7: 'github-logo',
} as const satisfies Record<number, IconName>
