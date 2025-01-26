import { Controller, useFormContext } from 'react-hook-form'
import { TextInput } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { type CreatePostForm } from '~/hooks/mutations/posts/create'
import { fonts } from '~/lib/fonts'
import { usePreferences } from '~/stores/preferences'

export function SubmissionLink() {
  const { fontSystem } = usePreferences()

  const t = useTranslations('component.submission.link')

  const { styles, theme } = useStyles(stylesheet)

  const { control } = useFormContext<CreatePostForm>()

  return (
    <Controller
      control={control}
      name="url"
      render={({ field }) => (
        <TextInput
          {...field}
          onChangeText={field.onChange}
          placeholder={t('placeholder')}
          placeholderTextColor={theme.colors.gray.accent}
          selectionColor={theme.colors.accent.accent}
          style={styles.input(fontSystem)}
        />
      )}
    />
  )
}

const stylesheet = createStyleSheet((theme) => ({
  input: (systemFont: boolean) => ({
    color: theme.colors.gray.text,
    fontFamily: systemFont ? fonts.system : fonts.sans,
    fontSize: theme.typography[4].fontSize,
    padding: theme.space[4],
  }),
}))
