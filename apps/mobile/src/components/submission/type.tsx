import { type BottomSheetModal } from '@gorhom/bottom-sheet'
import { compact } from 'lodash'
import { useRef } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Keyboard } from 'react-native'
import { useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { type CreatePostForm } from '~/hooks/mutations/posts/create'
import { type Submission } from '~/types/submission'

import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { SheetItem } from '../sheets/item'
import { SheetModal } from '../sheets/modal'

export type SubmissionType = 'text' | 'image' | 'video' | 'link'

type Props = {
  submission: Submission
}

export function SubmissionType({ submission }: Props) {
  const t = useTranslations('component.submission.type')

  const { theme } = useStyles()

  const sheet = useRef<BottomSheetModal>(null)

  const types = compact([
    submission.media.text && 'text',
    submission.media.image && 'image',
    submission.media.link && 'link',
  ] as const)

  const { control, setValue } = useFormContext<CreatePostForm>()

  return (
    <Controller
      control={control}
      name="type"
      render={({ field }) => (
        <>
          <Pressable
            align="center"
            direction="row"
            gap="2"
            hitSlop={theme.space[4]}
            onPress={() => {
              Keyboard.dismiss()

              sheet.current?.present()
            }}
          >
            <Text size="2" weight="medium">
              {t(field.value)}
            </Text>

            <Icon
              color={theme.colors.gray.text}
              name={
                field.value === 'image'
                  ? 'Image'
                  : field.value === 'link'
                    ? 'Link'
                    : 'TextAa'
              }
              weight="duotone"
            />
          </Pressable>

          <SheetModal ref={sheet} title={t('title')}>
            {types.map((item) => (
              <SheetItem
                icon={{
                  name:
                    item === 'image'
                      ? 'Image'
                      : item === 'link'
                        ? 'Link'
                        : 'TextAa',
                  type: 'icon',
                }}
                key={item}
                label={t(item)}
                onPress={() => {
                  if (item !== field.value) {
                    setValue('url', '')
                  }

                  field.onChange(item)

                  sheet.current?.close()
                }}
                selected={item === field.value}
              />
            ))}
          </SheetModal>
        </>
      )}
    />
  )
}
