import { Image } from 'expo-image'
import { useRef } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { type CreatePostForm } from '~/hooks/mutations/posts/create'
import { space } from '~/styles/tokens'
import { type Submission } from '~/types/submission'

import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'
import { Sheet } from '../common/sheet'
import { Text } from '../common/text'

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
              onPress={() => {
                sheet.current?.present()
              }}
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
                  accessibilityHint={a11y('selectFlair')}
                  accessibilityLabel={
                    item.type === 'text'
                      ? item.text
                      : item.flair.map((flair) => flair.value).join(' ')
                  }
                  key={item.id}
                  onPress={() => {
                    setValue('flairId', item.id)

                    sheet.current?.dismiss()
                  }}
                  style={styles.flair(item.id === field.value)}
                >
                  <FlairCard flair={item} />
                </Pressable>
              ))}

              <Sheet.BottomInset />
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
        style={[styles.item(flair.color, flair.background), styles.richText]}
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
    <View style={[styles.item(flair.color, flair.background), styles.text]}>
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
  flair: (selected: boolean) => ({
    alignItems: 'center',
    backgroundColor: selected ? theme.colors.accent.uiActive : undefined,
    flexDirection: 'row',
    gap: theme.space[3],
    padding: theme.space[3],
  }),
  item: (color: 'dark' | 'light', bg?: string) => ({
    backgroundColor: bg ?? (color === 'light' ? '#000' : '#fff'),
    borderCurve: 'continuous',
    borderRadius: theme.radius[6],
  }),
  label: (color: 'dark' | 'light') => ({
    color: color === 'dark' ? '#000' : '#fff',
  }),
  main: (error: boolean) => ({
    alignItems: 'center',
    backgroundColor:
      theme.colors[error ? 'red' : 'accent'][error ? 'accent' : 'ui'],
    flexDirection: 'row',
    gap: theme.space[2],
    height: theme.space[8],
    marginHorizontal: -theme.space[4],
    paddingHorizontal: theme.space[4],
  }),
  required: {
    marginLeft: 'auto',
  },
  richText: {
    flexDirection: 'row',
    gap: theme.space[2],
    paddingHorizontal: theme.space[2],
    paddingVertical: theme.space[1],
  },
  text: {
    paddingHorizontal: theme.space[2],
    paddingVertical: theme.space[1],
  },
}))
