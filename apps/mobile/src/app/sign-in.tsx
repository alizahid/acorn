import { zodResolver } from '@hookform/resolvers/zod'
import { createId } from '@paralleldrive/cuid2'
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from 'expo-router'
import { Controller, useForm } from 'react-hook-form'
import { View } from 'react-native'
import Animated from 'react-native-reanimated'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import { Button } from '~/components/common/button'
import { Logo } from '~/components/common/logo'
import { Text } from '~/components/common/text'
import { TextBox } from '~/components/common/text-box'
import { useKeyboard } from '~/hooks/keyboard'
import { useSignIn } from '~/hooks/mutations/auth/sign-in'
import { type GetAuthCodeForm, GetAuthCodeSchema } from '~/lib/reddit'
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

  const { control, handleSubmit } = useForm<GetAuthCodeForm>({
    defaultValues: {
      clientId: clientId ?? '',
      state: createId(),
    },
    resolver: zodResolver(GetAuthCodeSchema),
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
      style={[styles.main, keyboard.styles]}
    >
      <View style={styles.header}>
        <Logo size={128} style={styles.logo} />

        <Text size="8" weight="bold">
          {t('title')}
        </Text>

        <Text highContrast={false} size="2" weight="medium">
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
    </Animated.ScrollView>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  clientId: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    gap: theme.space[9],
    justifyContent: 'center',
    padding: theme.space[4],
  },
  form: {
    flexDirection: 'row',
    gap: theme.space[4],
  },
  header: {
    alignItems: 'center',
  },
  keyboard: {
    flex: 1,
  },
  logo: {
    marginBottom: theme.space[4],
  },
  main: {
    flex: 1,
  },
}))
