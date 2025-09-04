import { compact } from 'lodash'
import { Controller, useFormContext } from 'react-hook-form'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { type CreatePostForm } from '~/hooks/mutations/posts/create'
import { space } from '~/styles/tokens'
import { type Submission } from '~/types/submission'

import { ContextMenu } from '../common/context-menu'
import { Icon } from '../common/icon'
import { View } from '../common/view'

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
        <ContextMenu
          hitSlop={space[4]}
          label={t('title')}
          options={types.map((item) => ({
            action() {
              if (item !== field.value) {
                setValue('url', '')
              }

              field.onChange(item)
            },
            icon: {
              name:
                item === 'image'
                  ? 'image-duotone'
                  : item === 'link'
                    ? 'link-duotone'
                    : 'textbox-duotone',
              type: 'icon',
            },
            id: item,
            title: t(item),
          }))}
          tap
        >
          <View
            align="center"
            direction="row"
            gap="2"
            px="2"
            py="1"
            style={styles.main}
          >
            <Icon
              name={
                field.value === 'image'
                  ? 'Image'
                  : field.value === 'link'
                    ? 'Link'
                    : 'Textbox'
              }
              uniProps={(theme) => ({
                color: theme.colors.gray.text,
              })}
              weight="duotone"
            />

            <Icon
              name="CaretDown"
              uniProps={(theme) => ({
                color: theme.colors.gray.textLow,
                size: theme.space[4],
              })}
              weight="bold"
            />
          </View>
        </ContextMenu>
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
