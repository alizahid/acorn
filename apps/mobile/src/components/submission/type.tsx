import { type BottomSheetModal } from '@gorhom/bottom-sheet'
import { compact } from 'lodash'
import { useRef } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Keyboard } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { type CreatePostForm } from '~/hooks/mutations/posts/create'
import { type Submission } from '~/types/submission'

import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'
import { SheetItem } from '../sheets/item'
import { SheetModal } from '../sheets/modal'

type Props = {
  submission: Submission
}

export function SubmissionType({ submission }: Props) {
  const t = useTranslations('component.submission.type')

  const { styles, theme } = useStyles(stylesheet)

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
            px="2"
            py="1"
            style={styles.main}
          >
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

            <Icon
              color={theme.colors.gray.textLow}
              name="CaretDown"
              size={theme.space[4]}
              weight="bold"
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

const stylesheet = createStyleSheet((theme) => ({
  main: {
    backgroundColor: theme.colors.accent.ui,
    borderCurve: 'continuous',
    borderRadius: theme.radius[4],
  },
}))
