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
        <Text weight="medium">{t('nsfw')}</Text>

        <Controller
          control={control}
          name="nsfw"
          render={({ field }) => <Switch {...field} label={t('nsfw')} />}
        />
      </View>

      <View style={styles.item}>
        <Text weight="medium">{t('spoiler')}</Text>

        <Controller
          control={control}
          name="spoiler"
          render={({ field }) => <Switch {...field} label={t('spoiler')} />}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.space[2],
  },
  main: {
    flexDirection: 'row',
    gap: theme.space[4],
    justifyContent: 'space-between',
  },
}))
