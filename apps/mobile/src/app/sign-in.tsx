import { zodResolver } from '@hookform/resolvers/zod'
import * as Linking from 'expo-linking'
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { Controller, useForm } from 'react-hook-form'
import { Platform } from 'react-native'
import Animated from 'react-native-reanimated'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import { Button } from '~/components/common/button'
import { Copy } from '~/components/common/copy'
import { Logo } from '~/components/common/logo'
import { Text } from '~/components/common/text'
import { TextBox } from '~/components/common/text-box'
import { View } from '~/components/common/view'
import { useKeyboard } from '~/hooks/keyboard'
import { useSignIn } from '~/hooks/mutations/auth/sign-in'
import { type AuthCodeForm, AuthCodeSchema } from '~/reddit/auth'
import { REDIRECT_URI } from '~/reddit/config'
import { useAuth } from '~/stores/auth'

const schema = z.object({
  mode: z.enum(['dismissible', 'fixed']).catch('fixed'),
})

export default function Screen() {
  const router = useRouter()
  const navigation = useNavigation()

  const params = schema.parse(useLocalSearchParams())

  const t = useTranslations('screen.auth.signIn')

  const keyboard = useKeyboard()

  const { styles } = useStyles(stylesheet)

  const { clientId, setClientId } = useAuth()
  const { isPending, signIn } = useSignIn()

  useFocusEffect(() => {
    navigation.setOptions({
      gestureEnabled: params.mode === 'dismissible',
    })
  })

  const { control, handleSubmit } = useForm<AuthCodeForm>({
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
    <Animated.ScrollView
      contentContainerStyle={styles.content}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      style={[styles.main, keyboard.styles]}
    >
      {Platform.OS === 'ios' && !Platform.isPad ? (
        <StatusBar style="light" />
      ) : null}

      <View align="center">
        <Logo style={styles.logo} />

        <Text size="8" weight="bold">
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
          render={({ field, fieldState }) => (
            <TextBox
              {...field}
              autoCapitalize="none"
              autoCorrect={false}
              code
              error={
                fieldState.error ? t('form.field.clientId.error') : undefined
              }
              onChangeText={field.onChange}
              onSubmitEditing={() => {
                void onSubmit()
              }}
              placeholder={t('form.field.clientId.placeholder')}
              returnKeyType="go"
              style={styles.clientId}
            />
          )}
        />

        <Button
          label={t('form.action.submit')}
          loading={isPending}
          onPress={() => {
            void onSubmit()
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
                  void Linking.openURL('https://www.reddit.com/prefs/apps')
                }}
              >
                {text}
              </Text>
            ),
          })}
        </Text>

        <Copy value={REDIRECT_URI} />
      </View>
    </Animated.ScrollView>
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  clientId: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    gap: theme.space[9],
    justifyContent: 'center',
    padding: theme.space[4],
    paddingBottom: theme.space[4] + runtime.insets.bottom,
  },
  logo: {
    marginBottom: theme.space[4],
  },
  main: {
    flex: 1,
  },
}))
