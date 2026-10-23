import {
  deepLinkToSubscriptions,
  type Product,
  type ProductOrSubscription,
  type ProductSubscription,
} from 'expo-iap'
import { orderBy } from 'lodash'
import { useState } from 'react'
import { View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { StyleSheet } from 'react-native-unistyles'
import { useFormatter, useTranslations } from 'use-intl'

import { Button } from '~/components/common/button'
import { Icon, type IconName } from '~/components/common/icon'
import { Loading } from '~/components/common/loading'
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
  const t = useTranslations('screen.auth.subscribe')
  const f = useFormatter()

  const { subscription, isLoading } = useSubscribed()
  const { plans } = usePlans()

  const { restore, isPending: restoring } = useRestore()
  const { subscribe, isPending: subscribing } = useSubscribe()
  const { redeem, isPending: redeeming } = useRedeem()

  const [plan, setPlan] = useState<
    ProductOrSubscription | Product | ProductSubscription
  >()

  if (isLoading) {
    return <Loading />
  }

  return (
    <>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Logo />
        </View>

        {subscription ? (
          typeof subscription === 'boolean' ? null : (
            <View style={styles.subscribed}>
              <Text align="center" color="accent" size="8" weight="bold">
                {t('subscribed.title')}
              </Text>

              <Text align="center" highContrast={false} size="2">
                {t('subscribed.description')}
              </Text>

              <View style={styles.info}>
                {subscription.name ? (
                  <View style={styles.row}>
                    <Text
                      align="right"
                      highContrast={false}
                      style={styles.column}
                      weight="medium"
                    >
                      {t('subscribed.plan')}
                    </Text>

                    <Text style={styles.column}>{subscription.name}</Text>
                  </View>
                ) : null}

                {subscription.price ? (
                  <View style={styles.row}>
                    <Text
                      align="right"
                      highContrast={false}
                      style={styles.column}
                      weight="medium"
                    >
                      {t('subscribed.price')}
                    </Text>

                    <Text style={styles.column} tabular>
                      {f.number(subscription.price, {
                        currency: subscription.currency,
                        currencyDisplay: 'symbol',
                        style: 'currency',
                      })}
                    </Text>
                  </View>
                ) : null}

                {subscription.createdAt ? (
                  <View style={styles.row}>
                    <Text
                      align="right"
                      highContrast={false}
                      style={styles.column}
                      weight="medium"
                    >
                      {t('subscribed.createdAt')}
                    </Text>

                    <Text style={styles.column} tabular>
                      {f.dateTime(subscription.createdAt, {
                        dateStyle: 'medium',
                      })}
                    </Text>
                  </View>
                ) : null}

                {subscription.renewsAt ? (
                  <View style={styles.row}>
                    <Text
                      align="right"
                      highContrast={false}
                      style={styles.column}
                      weight="medium"
                    >
                      {t('subscribed.renewsAt')}
                    </Text>

                    <Text style={styles.column} tabular>
                      {f.dateTime(subscription.renewsAt, {
                        dateStyle: 'medium',
                      })}
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>
          )
        ) : plans ? (
          <View>
            {orderBy(plans, 'price').map((item) => (
              <Pressable
                key={item.id}
                onPress={() => {
                  setPlan((previous) =>
                    previous?.id === item.id ? undefined : item,
                  )
                }}
                style={styles.plan(item.id === plan?.id)}
                variant="plain"
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
          <Text size="2" weight="bold">
            {t('feature.title')}
          </Text>

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
      </ScrollView>

      {subscription ? (
        typeof subscription === 'boolean' ? null : subscription.type ===
          'in-app' ? null : (
          <View style={styles.footer}>
            <Button
              label={t('footer.manage')}
              onPress={() => {
                deepLinkToSubscriptions()
              }}
            />
          </View>
        )
      ) : (
        <View style={styles.footer}>
          <Button
            color="orange"
            disabled={!plan}
            label={t(
              plan?.id.includes('lifetime')
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
                type: plan.type,
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
      )}
    </>
  )
}

const styles = StyleSheet.create((theme, runtime) => ({
  button: {
    flex: 1,
  },
  column: {
    flex: 1,
  },
  content: {
    gap: theme.space[8],
    paddingVertical: theme.space[8],
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
    margin: theme.space[4],
    marginBottom: runtime.insets.bottom + theme.space[4],
  },
  header: {
    alignItems: 'center',
    gap: theme.space[4],
    marginHorizontal: theme.space[4],
  },
  info: {
    gap: theme.space[2],
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
  row: {
    flexDirection: 'row',
    gap: theme.space[4],
    justifyContent: 'center',
  },
  section: {
    flex: 1,
    gap: theme.space[4],
  },
  subscribe: {
    alignSelf: 'center',
  },
  subscribed: {
    gap: theme.space[6],
    padding: theme.space[4],
  },
}))

const icons = {
  1: 'infinity',
  2: 'list-checks',
  3: 'palette',
  4: 'broadcast',
  5: 'lock',
  6: 'person-simple-run',
  7: 'devices',
} as const satisfies Record<number, IconName>
