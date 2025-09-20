import { Image } from 'expo-image'
import { useRef } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { type CreatePostForm } from '~/hooks/mutations/posts/create'
import { space } from '~/styles/tokens'
import { type Submission } from '~/types/submission'

import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'
import { Sheet } from '../common/sheet'
import { Text } from '../common/text'
import { View } from '../common/view'

type Props = {
  submission: Submission
}

export function SubmissionFlair({ submission }: Props) {
  const t = useTranslations('component.submission.flair')
  const a11y = useTranslations('a11y')

  const sheet = useRef<Sheet>(null)

  const { control, setValue } = useFormContext<CreatePostForm>()

  if (submission.flair.length === 0) {
    return null
  }

  return (
    <Controller
      control={control}
      name="flairId"
      render={({ field, fieldState }) => {
        const selected = submission.flair.find(
          (item) => item.id === field.value,
        )

        return (
          <>
            <Pressable
              accessibilityLabel={t('label')}
              align="center"
              direction="row"
              gap="2"
              height="8"
              mx="-4"
              onPress={() => {
                sheet.current?.present()
              }}
              px="4"
              style={styles.main(Boolean(fieldState.error))}
            >
              {selected ? (
                <Pressable
                  accessibilityLabel={a11y('clearFlair')}
                  hitSlop={space[4]}
                  onPress={() => {
                    field.onChange()
                  }}
                >
                  <Icon
                    name="xmark"
                    uniProps={(theme) => ({
                      tintColor:
                        theme.colors.red[
                          fieldState.error ? 'contrast' : 'accent'
                        ],
                    })}
                  />
                </Pressable>
              ) : (
                <Icon
                  name="tag"
                  uniProps={(theme) => ({
                    tintColor:
                      theme.colors.red[
                        fieldState.error ? 'contrast' : 'accent'
                      ],
                  })}
                />
              )}

              {selected ? (
                <FlairCard flair={selected} />
              ) : (
                <Text weight="medium">{t('label')}</Text>
              )}

              {!selected && submission.rules.flair.required ? (
                <Text size="1" style={styles.required} weight="medium">
                  {t('required')}
                </Text>
              ) : null}
            </Pressable>

            <Sheet.Root ref={sheet}>
              <Sheet.Header title={t('title')} />

              {submission.flair.map((item) => (
                <Pressable
                  accessibilityLabel={
                    item.type === 'text'
                      ? item.text
                      : item.flair.map((flair) => flair.value).join(' ')
                  }
                  align="center"
                  direction="row"
                  gap="3"
                  key={item.id}
                  onPress={() => {
                    setValue('flairId', item.id)

                    sheet.current?.dismiss()
                  }}
                  p="3"
                  style={item.id === field.value && styles.selected}
                >
                  <FlairCard flair={item} />
                </Pressable>
              ))}
            </Sheet.Root>
          </>
        )
      }}
    />
  )
}

type FlairProps = {
  flair?: Submission['flair'][number]
}

function FlairCard({ flair }: FlairProps) {
  if (!flair) {
    return null
  }

  if (flair.type === 'richtext') {
    return (
      <View
        direction="row"
        gap="2"
        px="2"
        py="1"
        style={styles.item(flair.color, flair.background)}
      >
        {flair.flair.map((item) => {
          if (item.type === 'emoji') {
            return (
              <Image
                accessibilityIgnoresInvertColors
                key={item.id}
                source={item.value}
                style={styles.emoji}
              />
            )
          }

          return (
            <View key={item.id}>
              <Text size="1" style={styles.label(flair.color)}>
                {item.value}
              </Text>
            </View>
          )
        })}
      </View>
    )
  }

  return (
    <View px="2" py="1" style={styles.item(flair.color, flair.background)}>
      <Text size="1" style={styles.label(flair.color)}>
        {flair.text}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  emoji: {
    height: theme.typography[1].lineHeight,
    width: theme.typography[1].lineHeight,
  },
  item: (color: 'dark' | 'light', bg?: string) => ({
    backgroundColor: bg ?? (color === 'light' ? '#000' : '#fff'),
    borderCurve: 'continuous',
    borderRadius: theme.radius[6],
  }),
  label: (color: 'dark' | 'light') => ({
    color: color === 'dark' ? '#000' : '#fff',
  }),
  main: (error: boolean) => ({
    backgroundColor:
      theme.colors[error ? 'red' : 'accent'][error ? 'accent' : 'ui'],
  }),
  required: {
    marginLeft: 'auto',
  },
  selected: {
    backgroundColor: theme.colors.accent.uiActive,
  },
}))
