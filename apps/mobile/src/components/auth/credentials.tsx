import { zodResolver } from '@hookform/resolvers/zod'
import { createId } from '@paralleldrive/cuid2'
import { Controller, useForm } from 'react-hook-form'
import { type StyleProp, View, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Button } from '~/components/common/button'
import { useSignIn } from '~/hooks/mutations/auth/sign-in'
import { type GetAuthCodeForm, GetAuthCodeSchema } from '~/lib/reddit'
import { useAuth } from '~/stores/auth'

import { Text } from '../common/text'
import { TextBox } from '../common/text-box'

type Props = {
  style?: StyleProp<ViewStyle>
}

export function Credentials({ style }: Props) {
  const t = useTranslations('component.auth.credentials')

  const { styles } = useStyles(stylesheet)

  const { clientId, save } = useAuth()

  const { isPending, signIn } = useSignIn({
    onSuccess(data) {
      if (!data) {
        return
      }

      save(data)
    },
  })

  const { control, handleSubmit } = useForm<GetAuthCodeForm>({
    defaultValues: {
      clientId: clientId ?? '',
      state: createId(),
    },
    resolver: zodResolver(GetAuthCodeSchema),
  })

  const onSubmit = handleSubmit((data) => {
    signIn(data)
  })

  return (
    <View style={[styles.main, style]}>
      <Text weight="bold">{t('title')}</Text>

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
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: {
    gap: theme.space[4],
  },
}))
