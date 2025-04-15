import { compact } from 'lodash'
import { Controller, useFormContext } from 'react-hook-form'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { type CreatePostForm } from '~/hooks/mutations/posts/create'
import { type Submission } from '~/types/submission'

import { ContextMenu } from '../common/context-menu'
import { Icon } from '../common/icon'
import { View } from '../common/view'

type Props = {
  submission: Submission
}

export function SubmissionType({ submission }: Props) {
  const t = useTranslations('component.submission.type')

  const { styles, theme } = useStyles(stylesheet)

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
          hitSlop={theme.space[4]}
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
              color={theme.colors.gray.text}
              name={
                field.value === 'image'
                  ? 'Image'
                  : field.value === 'link'
                    ? 'Link'
                    : 'Textbox'
              }
              weight="duotone"
            />

            <Icon
              color={theme.colors.gray.textLow}
              name="CaretDown"
              size={theme.space[4]}
              weight="bold"
            />
          </View>
        </ContextMenu>
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
