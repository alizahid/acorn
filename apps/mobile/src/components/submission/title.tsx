import { Controller, useFormContext } from 'react-hook-form'
import { TextInput } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { type CreatePostForm } from '~/hooks/mutations/posts/create'
import { fonts } from '~/lib/fonts'
import { usePreferences } from '~/stores/preferences'

import { Text } from '../common/text'
import { View } from '../common/view'

export function SubmissionTitle() {
  const { fontSystem } = usePreferences()

  const t = useTranslations('component.submission.title')

  const { styles, theme } = useStyles(stylesheet)

  const { control } = useFormContext<CreatePostForm>()

  return (
    <Controller
      control={control}
      name="title"
      render={({ field, fieldState }) => (
        <View>
          <TextInput
            {...field}
            onChangeText={field.onChange}
            placeholder={t('placeholder')}
            placeholderTextColor={theme.colors.gray.accent}
            selectionColor={theme.colors.accent.accent}
            style={styles.input(fontSystem)}
          />

          {fieldState.error ? (
            <Text mx="4" size="2" style={styles.error}>
              {fieldState.error.message}
            </Text>
          ) : null}
        </View>
      )}
    />
  )
}

const stylesheet = createStyleSheet((theme) => ({
  error: {
    color: theme.colors.red.accent,
  },
  input: (systemFont: boolean) => ({
    color: theme.colors.gray.text,
    fontFamily: systemFont ? fonts.system : fonts.sans,
    fontSize: theme.typography[6].fontSize,
    padding: theme.space[4],
  }),
}))
