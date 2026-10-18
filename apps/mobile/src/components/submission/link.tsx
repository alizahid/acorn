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

export function SubmissionLink() {
  const t = useTranslations('component.submission.link')

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
      name="link"
      render={({ field, fieldState }) => (
        <View style={styles.main}>
          {fieldState.error ? (
            <Text accent color="red" mt="2" mx="4" size="2">
              {fieldState.error.message}
            </Text>
          ) : null}

          <TextInput
            {...field}
            allowFontScaling={systemScaling}
            autoCapitalize="none"
            autoComplete="url"
            autoCorrect={false}
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
  input: (font: Font, scaling: number) => ({
    color: theme.colors.gray.text,
    fontFamily: fonts[font],
    fontSize: theme.typography[4].fontSize * scaling,
    padding: theme.space[4],
  }),
  main: {
    backgroundColor: theme.colors.accent.ui,
  },
}))
