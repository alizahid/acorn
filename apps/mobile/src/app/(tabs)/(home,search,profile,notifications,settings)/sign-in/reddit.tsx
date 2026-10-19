import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import cookies from 'react-native-nitro-cookies'
import { StyleSheet } from 'react-native-unistyles'
import { WebView } from 'react-native-webview'
import { z } from 'zod'

import { Loading } from '~/components/common/loading'
import { useSignIn } from '~/hooks/mutations/auth/sign-in'
import { REDDIT_URI } from '~/reddit/api'

const schema = z.object({
  mode: z.enum(['dismissible', 'fixed']).catch('fixed'),
})

export type SignInParams = z.infer<typeof schema>

export default function Screen() {
  const router = useRouter()

  const { signIn, isPending } = useSignIn()

  const [cleared, setCleared] = useState(false)

  useEffect(() => {
    Promise.all([cookies.clearAll(), cookies.clearAll(true)]).finally(() => {
      setCleared(true)
    })
  }, [])

  if (!cleared) {
    return <Loading />
  }

  return (
    <WebView
      cacheEnabled={false}
      containerStyle={styles.content}
      injectedJavaScript={injected}
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
      renderLoading={() => <Loading style={styles.loading} />}
      source={{
        uri: `https://old.reddit.com/login/?dest=${encodeURI('/r/acornblue')}`,
      }}
      startInLoadingState
      style={styles.main}
    />
  )
}

const styles = StyleSheet.create((theme, runtime) => ({
  content: {
    paddingRight: runtime.insets.right,
  },
  loading: {
    ...StyleSheet.absoluteFillObject,
    height: 'auto',
    position: 'absolute',
  },
  main: {
    backgroundColor: theme.variant === 'dark' ? '#0e1113' : '#fff',
  },
}))

const injected = `(function() {
var style = document.createElement('style');
style.innerHTML = "body { background-color: ${styles.main.backgroundColor} !important; } [slot=closeButton] { display: none !important; } auth-flow-manager { z-index: 999 !important; } .shadow-sm { box-shadow: none !important; }";
document.head.appendChild(style);
})();`
