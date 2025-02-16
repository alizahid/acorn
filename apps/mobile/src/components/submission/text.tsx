import { Controller, useFormContext } from 'react-hook-form'
import { TextInput } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { type CreatePostForm } from '~/hooks/mutations/posts/create'
import { type Font, fonts } from '~/lib/fonts'
import { usePreferences } from '~/stores/preferences'

import { Text } from '../common/text'
import { View } from '../common/view'

export function SubmissionText() {
  const { font, fontScaling, systemScaling } = usePreferences()

  const t = useTranslations('component.submission.text')

  const { styles, theme } = useStyles(stylesheet)

  const { control } = useFormContext<CreatePostForm>()

  return (
    <Controller
      control={control}
      name="text"
      render={({ field, fieldState }) => (
        <View flexGrow={1}>
          <TextInput
            {...field}
            allowFontScaling={systemScaling}
            multiline
            onChangeText={field.onChange}
            placeholder={t('placeholder')}
            placeholderTextColor={theme.colors.gray.accent}
            selectionColor={theme.colors.accent.accent}
            style={styles.input(font, fontScaling)}
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
  input: (font: Font, scaling: number) => ({
    color: theme.colors.gray.text,
    flexGrow: 1,
    fontFamily: fonts[font],
    fontSize: theme.typography[3].fontSize * scaling,
    lineHeight: theme.typography[3].lineHeight * scaling,
    padding: theme.space[4],
  }),
}))
