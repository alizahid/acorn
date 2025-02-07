import { type BottomSheetModal } from '@gorhom/bottom-sheet'
import { Image } from 'expo-image'
import { useRef } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { type CreatePostForm } from '~/hooks/mutations/posts/create'
import { type Submission } from '~/types/submission'

import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { View } from '../common/view'
import { SheetModal } from '../sheets/modal'

type Props = {
  submission: Submission
}

export function SubmissionFlair({ submission }: Props) {
  const t = useTranslations('component.submission.flair')

  const sheet = useRef<BottomSheetModal>(null)

  const { styles, theme } = useStyles(stylesheet)

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

        const color = theme.colors.red[fieldState.error ? 'contrast' : 'accent']

        return (
          <>
            <Pressable
              align="center"
              direction="row"
              gap="2"
              height="8"
              mx="-4"
              onPress={() => {
                sheet.current?.present()
              }}
              px="3"
              style={styles.main(Boolean(fieldState.error))}
            >
              {selected ? (
                <Pressable
                  hitSlop={theme.space[4]}
                  onPress={() => {
                    field.onChange()
                  }}
                >
                  <Icon color={color} name="X" weight="bold" />
                </Pressable>
              ) : (
                <Icon color={color} name="SmileyWink" weight="bold" />
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

            <SheetModal ref={sheet} title={t('title')}>
              {submission.flair.map((item) => (
                <Pressable
                  align="center"
                  direction="row"
                  gap="3"
                  key={item.id}
                  onPress={() => {
                    setValue('flairId', item.id)

                    sheet.current?.close()
                  }}
                  p="3"
                  style={item.id === field.value && styles.selected}
                >
                  <FlairCard flair={item} />
                </Pressable>
              ))}
            </SheetModal>
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
  const { styles } = useStyles(stylesheet)

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
              <Image key={item.id} source={item.value} style={styles.emoji} />
            )
          }

          return (
            <View key={item.id}>
              <Text size="2" style={styles.label(flair.color)}>
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
      <Text size="2" style={styles.label(flair.color)}>
        {flair.text}
      </Text>
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  emoji: {
    height: theme.typography[2].lineHeight,
    width: theme.typography[2].lineHeight,
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
      theme.colors[error ? 'red' : 'accent'][error ? 'accent' : 'bgAltAlpha'],
  }),
  required: {
    marginLeft: 'auto',
  },
  selected: {
    backgroundColor: theme.colors.accent.uiActive,
  },
}))
