import { useRouter } from 'expo-router'
import { type ComponentRef, useRef, useState } from 'react'
import cookies from 'react-native-nitro-cookies'
import { StyleSheet } from 'react-native-unistyles'
import WebView from 'react-native-webview'
import { z } from 'zod'

import { useSignIn } from '~/hooks/mutations/auth/sign-in'
import { REDDIT_URI } from '~/reddit/api'

const schema = z.object({
  mode: z.enum(['dismissible', 'fixed']).catch('fixed'),
})

export type SignInParams = z.infer<typeof schema>

export default function Screen() {
  const router = useRouter()

  const { signIn, isPending } = useSignIn()

  const webView = useRef<ComponentRef<typeof WebView>>(null)

  const [cleared, setCleared] = useState(false)

  const source = cleared
    ? {
        uri: `https://www.reddit.com/login/?dest=${encodeURI('/r/acornblue')}`,
      }
    : {
        html: '',
      }

  return (
    <WebView
      containerStyle={styles.content}
      injectedJavaScript={injected}
      onLoadEnd={() => {
        if (cleared) {
          return
        }

        webView.current?.clearCache(true)

        setCleared(true)
      }}
      onMessage={() => {
        //
      }}
      onNavigationStateChange={async (event) => {
        if (isPending || event.loading) {
          return
        }

        const jar = await cookies.get(REDDIT_URI, true)

        if (!jar.reddit_session) {
          return
        }

        signIn(jar.reddit_session.value)

        router.dismissAll()
      }}
      ref={webView}
      sharedCookiesEnabled
      source={source}
      style={styles.main}
    />
  )
}

const styles = StyleSheet.create((theme, runtime) => ({
  content: {
    paddingRight: runtime.insets.right,
  },
  main: {
    backgroundColor: theme.variant === 'dark' ? '#0e1113' : '#fff',
  },
}))

const injected = `(function() {
var style = document.createElement('style');
style.innerHTML = "body { background-color: ${styles.main.backgroundColor} !important; } #data-protection-consent-dialog, [slot=closeButton] { display: none !important; } .shadow-sm { box-shadow: none !important; }";
document.head.appendChild(style);
})();`
