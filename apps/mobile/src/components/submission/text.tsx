import { Controller, useFormContext } from 'react-hook-form'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { type CreatePostForm } from '~/hooks/mutations/posts/create'
import { type Font, fonts } from '~/lib/fonts'
import { usePreferences } from '~/stores/preferences'

import { Text } from '../common/text'
import { View } from '../common/view'
import { TextInput } from '../native/text-input'

export function SubmissionText() {
  const { font, fontScaling, systemScaling } = usePreferences()

  const t = useTranslations('component.submission.text')

  const { control } = useFormContext<CreatePostForm>()

  return (
    <Controller
      control={control}
      name="text"
      render={({ field, fieldState }) => (
        <View flexGrow={1}>
          {fieldState.error ? (
            <Text mx="4" size="2" style={styles.error}>
              {fieldState.error.message}
            </Text>
          ) : null}

          <TextInput
            {...field}
            allowFontScaling={systemScaling}
            multiline
            onChangeText={field.onChange}
            placeholder={t('placeholder')}
            scrollEnabled={false}
            style={styles.input(font, fontScaling)}
          />
        </View>
      )}
    />
  )
}

const styles = StyleSheet.create((theme) => ({
  error: {
    color: theme.colors.red.accent,
  },
  input: (font: Font, scaling: number) => ({
    color: theme.colors.gray.text,
    flexGrow: 1,
    fontFamily: fonts[font],
    fontSize: theme.typography[3].fontSize * scaling,
    lineHeight: theme.typography[3].lineHeight * scaling,
    padding: theme.space[4],
  }),
}))
