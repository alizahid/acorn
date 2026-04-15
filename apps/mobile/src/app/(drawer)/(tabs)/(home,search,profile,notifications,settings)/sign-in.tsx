import { isTestFlight } from 'expo-testflight'
import { useState } from 'react'
import { View } from 'react-native'
import cookies from 'react-native-nitro-cookies'
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'
import WebView from 'react-native-webview'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import { Button } from '~/components/common/button'
import { Empty } from '~/components/common/empty'
import { Logo } from '~/components/common/logo'
import { Text } from '~/components/common/text'
import { useSignIn } from '~/hooks/mutations/auth/sign-in'
import { useSubscribed } from '~/hooks/purchases/subscribed'
import { REDDIT_URI } from '~/reddit/api'

const schema = z.object({
  mode: z.enum(['dismissible', 'fixed']).catch('fixed'),
})

export type SignInParams = z.infer<typeof schema>

export default function Screen() {
  const t = useTranslations('screen.auth.signIn')

  const { signIn, isPending } = useSignIn()
  const { subscribed, isLoading } = useSubscribed()

  const [open, setOpen] = useState(false)

  return (
    <>
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
          disabled={!(isTestFlight || subscribed)}
          label={t('signIn')}
          loading={isPending || isLoading}
          onPress={() => {
            setOpen(true)
          }}
        />
      </View>

      {open ? (
        <Animated.View
          entering={SlideInDown}
          exiting={SlideOutDown}
          style={styles.webView}
        >
          <WebView
            onNavigationStateChange={async (event) => {
              if (isPending || event.loading) {
                return
              }

              const jar = await cookies.get(REDDIT_URI, true)

              if (!jar.reddit_session) {
                return
              }

              signIn(jar.reddit_session.value)

              setOpen(false)
            }}
            renderLoading={() => <Empty />}
            sharedCookiesEnabled
            source={{
              uri: `https://www.reddit.com/login/?dest=${encodeURI('/r/acornblue')}`,
            }}
          />
        </Animated.View>
      ) : null}
    </>
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
  webView: {
    ...StyleSheet.absoluteFillObject,
  },
}))
