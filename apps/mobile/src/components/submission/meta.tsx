import { Controller, useFormContext } from 'react-hook-form'
import { useTranslations } from 'use-intl'

import { type CreatePostForm } from '~/hooks/mutations/posts/create'

import { Switch } from '../common/switch'
import { Text } from '../common/text'
import { View } from '../common/view'

export function SubmissionMeta() {
  const t = useTranslations('component.submission.meta')

  const { control } = useFormContext<CreatePostForm>()

  return (
    <View direction="row" gap="4" justify="between">
      <View align="center" direction="row" gap="2">
        <Text weight="medium">{t('nsfw')}</Text>

        <Controller
          control={control}
          name="nsfw"
          render={({ field }) => <Switch {...field} />}
        />
      </View>

      <View align="center" direction="row" gap="2">
        <Text weight="medium">{t('spoiler')}</Text>

        <Controller
          control={control}
          name="spoiler"
          render={({ field }) => <Switch {...field} />}
        />
      </View>
    </View>
  )
}
