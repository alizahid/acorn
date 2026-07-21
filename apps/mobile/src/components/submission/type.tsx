import { useRef } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslations } from 'use-intl'

import { type CreatePostForm } from '~/hooks/mutations/posts/create'
import { type SubmissionType } from '~/types/submission'

import { Icon, type IconName } from '../common/icon'
import { IconButton } from '../common/icon/button'
import { Sheet } from '../common/sheet'

type Props = {
  types: Array<SubmissionType>
}

export function SubmissionType({ types }: Props) {
  const t = useTranslations('component.submission.type')
  const a11y = useTranslations('a11y')

  const { control, setValue } = useFormContext<CreatePostForm>()

  const sheet = useRef<Sheet>(null)

  return (
    <Controller
      control={control}
      name="type"
      render={({ field }) => (
        <>
          <IconButton
            accessibilityLabel={a11y('changePostType')}
            hitSlop={16}
            onPress={() => {
              sheet.current?.present()
            }}
            size="5"
          >
            <Icon
              name={icons[field.value]}
              uniProps={(theme) => ({
                size: theme.space[5],
              })}
            />
          </IconButton>

          <Sheet.Root ref={sheet}>
            <Sheet.Header title={t('title')} />

            {types.map((item) => (
              <Sheet.Item
                key={item}
                label={t(item)}
                left={<Icon name={icons[item]} />}
                onPress={() => {
                  sheet.current?.dismiss()

                  if (item !== field.value) {
                    setValue('url', '')
                  }

                  field.onChange(item)
                }}
                selected={item === field.value}
              />
            ))}

            <Sheet.BottomInset />
          </Sheet.Root>
        </>
      )}
    />
  )
}

const icons = {
  image: 'image',
  link: 'link',
  text: 'text-aa',
  video: 'video',
} as const satisfies Record<string, IconName>
