import { useRouter } from 'expo-router'
// biome-ignore lint/performance/noNamespaceImport: go away
import * as WebBrowser from 'expo-web-browser'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import { Button } from '~/components/common/button'
import { Logo } from '~/components/common/logo'
import { Pressable } from '~/components/common/pressable'
import { Text } from '~/components/common/text'

const schema = z.object({
  mode: z.enum(['dismissible', 'fixed']).catch('fixed'),
})

export type SignInParams = z.infer<typeof schema>

export default function Screen() {
  const router = useRouter()

  const t = useTranslations('screen.auth.signIn')

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

      <View style={styles.footer}>
        <Button
          label={t('signIn')}
          onPress={() => {
            router.navigate('/sign-in/reddit')
          }}
        />

        <Pressable
          onPress={async () => {
            await WebBrowser.warmUpAsync()

            await WebBrowser.openBrowserAsync('https://acorn.blue/terms')
          }}
        >
          <Text align="center" size="2">
            {t.rich('terms', {
              link: (text) => (
                <Text color="accent" size="2">
                  {text}
                </Text>
              ),
            })}
          </Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  content: {
    alignItems: 'center',
  },
  footer: {
    alignItems: 'center',
    gap: theme.space[4],
    padding: theme.space[4],
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
