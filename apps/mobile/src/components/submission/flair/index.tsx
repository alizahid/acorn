import { useRef } from 'react'
import { Controller } from 'react-hook-form'
import { ScrollView } from 'react-native-gesture-handler'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Icon } from '../../common/icon'
import { IconButton } from '../../common/icon/button'
import { Pressable } from '../../common/pressable'
import { Sheet } from '../../common/sheet'
import { Text } from '../../common/text'
import { useSubmission } from '../provider'
import { FlairCard } from './card'

export function SubmissionFlair() {
  const t = useTranslations('component.submission.flair')

  const sheet = useRef<Sheet>(null)

  const { submission, form } = useSubmission()

  if (submission.flair.length === 0) {
    return null
  }

  return (
    <Controller
      control={form.control}
      name="flairId"
      render={({ field, fieldState }) => {
        const selected = submission.flair.find(
          (item) => item.id === field.value,
        )

        return (
          <>
            <Pressable
              accessibilityLabel={t('label')}
              onPress={() => {
                sheet.current?.present()
              }}
              style={styles.main(Boolean(fieldState.error))}
            >
              <IconButton
                accessibilityLabel={t('clear')}
                disabled={!selected}
                onPress={() => {
                  field.onChange()
                }}
              >
                {selected ? (
                  <Icon
                    name="x-bold"
                    uniProps={(theme) => ({
                      color: fieldState.error
                        ? theme.colors.red.contrast
                        : theme.colors.red.accent,
                    })}
                  />
                ) : (
                  <Icon
                    name="tag"
                    uniProps={(theme) => ({
                      color: fieldState.error
                        ? theme.colors.red.contrast
                        : theme.colors.red.accent,
                    })}
                  />
                )}
              </IconButton>

              {selected ? (
                <FlairCard flair={selected} />
              ) : (
                <Text size="2" weight="medium">
                  {t('label')}
                </Text>
              )}
            </Pressable>

            <Sheet.Root ref={sheet} scrollable>
              <Sheet.Header title={t('title')} />

              <ScrollView contentContainerStyle={styles.content}>
                {submission.flair.map((item) => (
                  <Pressable
                    accessibilityHint={t('label')}
                    accessibilityLabel={
                      item.type === 'text'
                        ? item.text
                        : item.flair.map((flair) => flair.value).join(' ')
                    }
                    key={item.id}
                    onPress={() => {
                      form.setValue('flairId', item.id)

                      sheet.current?.dismiss()
                    }}
                    style={styles.flair(item.id === field.value)}
                  >
                    <FlairCard flair={item} />
                  </Pressable>
                ))}
              </ScrollView>
            </Sheet.Root>
          </>
        )
      }}
    />
  )
}

const styles = StyleSheet.create((theme, runtime) => ({
  content: {
    paddingBottom: theme.space[4] + runtime.insets.bottom,
  },
  flair: (selected: boolean) => ({
    alignItems: 'center',
    backgroundColor: selected ? theme.colors.accent.uiActive : undefined,
    flexDirection: 'row',
    gap: theme.space[3],
    padding: theme.space[3],
  }),
  main: (error: boolean) => ({
    alignItems: 'center',
    backgroundColor: error ? theme.colors.red.accent : theme.colors.accent.ui,
    flexDirection: 'row',
    height: theme.space[8],
  }),
}))
