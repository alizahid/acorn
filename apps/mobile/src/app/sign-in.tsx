import { zodResolver } from '@hookform/resolvers/zod'
import { createId } from '@paralleldrive/cuid2'
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { Controller, useForm } from 'react-hook-form'
import { View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Button } from '~/components/common/button'
import { Logo } from '~/components/common/logo'
import { Text } from '~/components/common/text'
import { TextBox } from '~/components/common/text-box'
import { useSignIn } from '~/hooks/mutations/auth/sign-in'
import { type GetAuthCodeForm, GetAuthCodeSchema } from '~/lib/reddit'
import { useAuth } from '~/stores/auth'

type Params = {
  mode?: 'dismissible'
}

export default function Screen() {
  const router = useRouter()
  const navigation = useNavigation()
  const params = useLocalSearchParams<Params>()

  const t = useTranslations('screen.auth.signIn')

  const { styles, theme } = useStyles(stylesheet)

  const { clientId, setClientId } = useAuth()
  const { isPending, signIn } = useSignIn()

  useFocusEffect(() => {
    if (!params.mode) {
      return
    }

    navigation.setOptions({
      gestureEnabled: true,
    })
  })

  const { control, handleSubmit } = useForm<GetAuthCodeForm>({
    defaultValues: {
      clientId: clientId ?? '',
      state: createId(),
    },
    resolver: zodResolver(GetAuthCodeSchema),
  })

  const onSubmit = handleSubmit(async (data) => {
    setClientId(data.clientId)

    await signIn(data)

    router.dismiss()
  })

  return (
    <View style={styles.main}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Logo size={theme.space[9]} style={styles.logo} />

        <Text align="center" size="6" weight="bold">
          {t('title')}
        </Text>

        <Text align="center" highContrast={false} weight="medium">
          {t('description')}
        </Text>
      </View>

      <View style={styles.form}>
        <Controller
          control={control}
          name="clientId"
          render={({ field, fieldState }) => (
            <TextBox
              {...field}
              autoCapitalize="none"
              autoCorrect={false}
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
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  clientId: {
    flex: 1,
  },
  form: {
    flexDirection: 'row',
    gap: theme.space[4],
  },
  header: {
    gap: theme.space[2],
  },
  logo: {
    alignSelf: 'center',
  },
  main: {
    flex: 1,
    gap: theme.space[9],
    justifyContent: 'center',
    padding: theme.space[4],
  },
}))
