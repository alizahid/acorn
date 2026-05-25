import Menu from '@expo/ui/community/menu'
import { type SFSymbol } from 'expo-symbols'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslations } from 'use-intl'

import { type CreatePostForm } from '~/hooks/mutations/posts/create'
import { type SubmissionType } from '~/types/submission'

import { Icon } from '../common/icon'

type Props = {
  types: Array<SubmissionType>
}

export function SubmissionType({ types }: Props) {
  const t = useTranslations('component.submission.type')

  const { control, setValue } = useFormContext<CreatePostForm>()

  return (
    <Controller
      control={control}
      name="type"
      render={({ field }) => (
        <Menu
          actions={types.map((type) => ({
            id: type,
            image: icons[type],
            state: type === field.value ? 'on' : 'off',
            title: t(type),
          }))}
          onPressAction={(event) => {
            const next = event.nativeEvent.event

            if (next !== field.value) {
              setValue('url', '')
            }

            field.onChange(next)
          }}
        >
          <Icon
            name={icons[field.value]}
            uniProps={(theme) => ({
              size: theme.space[6],
            })}
            weight={field.value === 'text' ? 'bold' : undefined}
          />
        </Menu>
      )}
    />
  )
}

const icons = {
  image: 'photo',
  link: 'link',
  text: 'textformat.abc',
  video: 'video',
} as const satisfies Record<string, SFSymbol>
