import { Controller } from 'react-hook-form'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { useShallow } from 'zustand/react/shallow'

import { type Font, fonts } from '~/lib/fonts'
import { usePreferences } from '~/stores/preferences'

import { Text } from '../common/text'
import { TextInput } from '../native/text-input'
import { useSubmission } from './provider'

export function SubmissionTitle() {
  const t = useTranslations('component.submission.title')

  const { font, fontScaling, systemScaling } = usePreferences(
    useShallow((state) => ({
      font: state.font,
      fontScaling: state.fontScaling,
      systemScaling: state.systemScaling,
    })),
  )

  const { form } = useSubmission()

  return (
    <Controller
      control={form.control}
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
            style={styles.input(font, systemScaling ? 1 : fontScaling)}
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
    fontFamily: fonts[font],
    fontSize: theme.typography[6].fontSize * scaling,
    padding: theme.space[4],
  }),
}))
