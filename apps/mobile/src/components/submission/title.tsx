import { Controller, useFormContext } from 'react-hook-form'
import { TextInput } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { type CreatePostForm } from '~/hooks/mutations/posts/create'
import { type Font, fonts } from '~/lib/fonts'
import { usePreferences } from '~/stores/preferences'

import { Text } from '../common/text'
import { View } from '../common/view'

export function SubmissionTitle() {
  const { font, fontScaling, systemScaling } = usePreferences()

  const t = useTranslations('component.submission.title')

  const { styles, theme } = useStyles(stylesheet)

  const { control } = useFormContext<CreatePostForm>()

  return (
    <Controller
      control={control}
      name="title"
      render={({ field, fieldState }) => (
        <View>
          {fieldState.error ? (
            <Text mx="4" size="2" style={styles.error}>
              {fieldState.error.message}
            </Text>
          ) : null}

          <TextInput
            {...field}
            allowFontScaling={systemScaling}
            onChangeText={field.onChange}
            placeholder={t('placeholder')}
            placeholderTextColor={theme.colors.gray.accent}
            selectionColor={theme.colors.accent.accent}
            style={styles.input(font, fontScaling)}
          />
        </View>
      )}
    />
  )
}

const stylesheet = createStyleSheet((theme) => ({
  error: {
    color: theme.colors.red.accent,
  },
  input: (font: Font, scaling: number) => ({
    color: theme.colors.gray.text,
    fontFamily: fonts[font],
    fontSize: theme.typography[6].fontSize * scaling,
    padding: theme.space[4],
  }),
}))
