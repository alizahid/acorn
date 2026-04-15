import { useCallback, useRef, useState } from 'react'
import { View } from 'react-native'
import NitroCookies from 'react-native-nitro-cookies'
import { StyleSheet } from 'react-native-unistyles'
import { type WebViewNavigation } from 'react-native-webview'
import WebView from 'react-native-webview'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import { Button } from '~/components/common/button'
import { Logo } from '~/components/common/logo'
import { Text } from '~/components/common/text'
import { useSignIn } from '~/hooks/mutations/auth/sign-in'

const schema = z.object({
  mode: z.enum(['dismissible', 'fixed']).catch('fixed'),
})

export type SignInParams = z.infer<typeof schema>

const LOGIN_URL = 'https://www.reddit.com/login'

export default function Screen() {
  const t = useTranslations('screen.auth.signIn')

  const { isPending, signIn } = useSignIn()

  const [showWebView, setShowWebView] = useState(false)

  const loggingIn = useRef(false)

  const handleNavigationChange = useCallback(
    async (event: WebViewNavigation) => {
      if (loggingIn.current || event.loading) {
        return
      }

      const cookies = await NitroCookies.get('https://www.reddit.com', true)

      if (!cookies.reddit_session) {
        return
      }

      loggingIn.current = true

      setShowWebView(false)

      await signIn(cookies.reddit_session.value)
    },
    [signIn],
  )

  if (showWebView) {
    return (
      <View style={styles.webView}>
        <WebView
          sharedCookiesEnabled
          source={{ uri: LOGIN_URL }}
          thirdPartyCookiesEnabled
          onNavigationStateChange={handleNavigationChange}
        />
      </View>
    )
  }

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
        label={t('signIn')}
        loading={isPending}
        onPress={() => {
          loggingIn.current = false

          setShowWebView(true)
        }}
      />
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
  webView: {
    flex: 1,
  },
}))
