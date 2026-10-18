import { Controller } from 'react-hook-form'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { type SubmissionType } from '~/types/submission'

import { Icon, type IconName } from '../common/icon'
import { IconButton } from '../common/icon/button'
import { SFSymbol } from '../common/icon/symbol'
import { useSubmission } from './provider'

type Props = {
  types: Array<SubmissionType>
}

export function SubmissionMeta({ types }: Props) {
  const t = useTranslations('component.submission.meta')
  const a11y = useTranslations('a11y')

  const { submission, form } = useSubmission()

  return (
    <View style={styles.main}>
      <Controller
        control={form.control}
        name="type"
        render={({ field }) => (
          <View style={styles.item}>
            {types.map((type) => (
              <IconButton
                accessibilityLabel={a11y(translations[type])}
                key={type}
                onPress={() => {
                  field.onChange(type === field.value ? 'text' : type)
                }}
              >
                <Icon
                  name={icons[type]}
                  uniProps={(theme) => ({
                    color:
                      type === field.value
                        ? theme.colors.accent.accent
                        : theme.colors.gray.text,
                  })}
                />
              </IconButton>
            ))}
          </View>
        )}
      />

      <View style={styles.item}>
        <Controller
          control={form.control}
          name="nsfw"
          render={({ field }) => (
            <IconButton
              accessibilityLabel={t('nsfw')}
              onPress={() => {
                field.onChange(!field.value)
              }}
            >
              <SFSymbol
                name="18.circle"
                uniProps={(theme) => ({
                  tintColor: field.value
                    ? theme.colors.accent.accent
                    : theme.colors.gray.text,
                })}
              />
            </IconButton>
          )}
        />

        {submission.media.spoiler ? (
          <Controller
            control={form.control}
            name="spoiler"
            render={({ field }) => (
              <IconButton
                accessibilityLabel={t('spoiler')}
                onPress={() => {
                  field.onChange(!field.value)
                }}
              >
                <Icon
                  name="warning"
                  uniProps={(theme) => ({
                    color: field.value
                      ? theme.colors.accent.accent
                      : theme.colors.gray.text,
                  })}
                />
              </IconButton>
            )}
          />
        ) : null}
      </View>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  item: {
    flexDirection: 'row',
  },
  main: {
    backgroundColor: theme.colors.gray.bgAlt,
    flexDirection: 'row',
    gap: theme.space[4],
    justifyContent: 'space-between',
  },
}))

const icons = {
  image: 'image',
  link: 'link',
  text: 'text-aa',
  video: 'video',
} as const satisfies Record<SubmissionType, IconName>

const translations = {
  image: 'addImage',
  link: 'addLink',
  text: 'addText',
  video: 'addVideo',
} as const satisfies Record<SubmissionType, string>
