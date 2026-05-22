import Menu from '@expo/ui/community/menu'
import { type SFSymbol } from 'expo-symbols'
import { compact } from 'lodash'
import { Controller, useFormContext } from 'react-hook-form'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { type CreatePostForm } from '~/hooks/mutations/posts/create'
import { type Submission } from '~/types/submission'

import { IconButton } from '../common/icon/button'

type Props = {
  submission: Submission
}

export function SubmissionType({ submission }: Props) {
  const t = useTranslations('component.submission.type')

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
          <IconButton
            contrast
            icon={icons[field.value]}
            label={t(field.value)}
            size="7"
            style={styles.main}
          />
        </Menu>
      )}
    />
  )
}

const styles = StyleSheet.create((theme) => ({
  main: {
    backgroundColor: theme.colors.accent.ui,
    borderCurve: 'continuous',
    borderRadius: theme.radius[4],
  },
}))

const icons = {
  image: 'photo',
  link: 'link',
  text: 'textformat.abc',
  video: 'video',
} as const satisfies Record<string, SFSymbol>
