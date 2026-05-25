import { Controller, useFormContext } from 'react-hook-form'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { type CreatePostForm } from '~/hooks/mutations/posts/create'

import { Switch } from '../common/switch'
import { Text } from '../common/text'

export function SubmissionMeta() {
  const t = useTranslations('component.submission.meta')

  const { control } = useFormContext<CreatePostForm>()

  return (
    <View style={styles.main}>
      <View style={styles.item}>
        <Controller
          control={control}
          name="nsfw"
          render={({ field }) => <Switch {...field} label={t('nsfw')} />}
        />

        <Text weight="medium">{t('nsfw')}</Text>
      </View>

      <View style={styles.item}>
        <Controller
          control={control}
          name="spoiler"
          render={({ field }) => <Switch {...field} label={t('spoiler')} />}
        />

        <Text weight="medium">{t('spoiler')}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.space[3],
  },
  main: {
    flexDirection: 'row',
    gap: theme.space[4],
    justifyContent: 'space-between',
  },
}))
