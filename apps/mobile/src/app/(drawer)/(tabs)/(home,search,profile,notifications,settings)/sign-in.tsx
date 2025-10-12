import { zodResolver } from '@hookform/resolvers/zod'
// biome-ignore lint/performance/noNamespaceImport: go away
import * as Linking from 'expo-linking'
import { useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { Controller, useForm } from 'react-hook-form'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import { Button } from '~/components/common/button'
import { Copy } from '~/components/common/copy'
import { Logo } from '~/components/common/logo'
import { Text } from '~/components/common/text'
import { TextBox } from '~/components/common/text-box'
import { View } from '~/components/common/view'
import { useSignIn } from '~/hooks/mutations/auth/sign-in'
import { glass, iPhone } from '~/lib/common'
import { AuthCodeSchema } from '~/reddit/auth'
import { REDIRECT_URI } from '~/reddit/config'
import { useAuth } from '~/stores/auth'

const schema = z.object({
  mode: z.enum(['dismissible', 'fixed']).catch('fixed'),
})

export type SignInParams = z.infer<typeof schema>

export default function Screen() {
  const router = useRouter()

  const t = useTranslations('screen.auth.signIn')

  const { clientId, setClientId } = useAuth()
  const { isPending, signIn } = useSignIn()

  const { control, handleSubmit } = useForm({
    defaultValues: {
      clientId: clientId ?? '',
      state: String(Math.random()),
    },
    resolver: zodResolver(AuthCodeSchema),
  })

  const onSubmit = handleSubmit(async (data) => {
    if (isPending) {
      return
    }

    setClientId(data.clientId)

    const success = await signIn(data)

    if (success) {
      router.dismiss()
    }
  })

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.content}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
    >
      {iPhone && !glass ? <StatusBar style="light" /> : null}

      <View align="center">
        <Logo />

        <Text mt="4" size="8" style={styles.title} weight="bold">
          {t('title')}
        </Text>

        <Text highContrast={false} mt="2" size="2" weight="medium">
          {t('description')}
        </Text>
      </View>

      <View direction="row" gap="4">
        <Controller
          control={control}
          name="clientId"
          render={({ field }) => (
            <TextBox
              {...field}
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={field.onChange}
              onSubmitEditing={() => {
                onSubmit()
              }}
              placeholder={t('form.field.clientId.placeholder')}
              returnKeyType="go"
              style={styles.clientId}
              variant="mono"
            />
          )}
        />

        <Button
          label={t('form.action.submit')}
          loading={isPending}
          onPress={() => {
            onSubmit()
          }}
        />
      </View>

      <View gap="4">
        <Text>
          {t.rich('instructions', {
            link: (text) => (
              <Text
                color="accent"
                onPress={() => {
                  Linking.openURL('https://www.reddit.com/prefs/apps')
                }}
              >
                {text}
              </Text>
            ),
          })}
        </Text>

        <Copy value={REDIRECT_URI} />
      </View>
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create((theme) => ({
  clientId: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    gap: theme.space[9],
    justifyContent: 'center',
    paddingHorizontal: theme.space[4],
    paddingVertical: theme.space[9],
  },
  title: {
    color: theme.colors.accent.accent,
  },
}))
