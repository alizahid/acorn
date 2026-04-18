import { Button, Host, Menu } from '@expo/ui/swift-ui'
import { labelStyle, tint } from '@expo/ui/swift-ui/modifiers'
import { compact } from 'lodash'
import { Controller, useFormContext } from 'react-hook-form'
import { View } from 'react-native'
import { StyleSheet, useUnistyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { type CreatePostForm } from '~/hooks/mutations/posts/create'
import { type Submission } from '~/types/submission'

import { Icon } from '../common/icon'

type Props = {
  submission: Submission
}

export function SubmissionType({ submission }: Props) {
  const t = useTranslations('component.submission.type')

  const { theme } = useUnistyles()

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
        <Host colorScheme={theme.variant} matchContents>
          <Menu
            label={
              <View style={styles.main}>
                <Icon
                  name={
                    field.value === 'image'
                      ? 'photo'
                      : field.value === 'link'
                        ? 'link'
                        : 'textformat.abc'
                  }
                  tintColor={theme.colors.gray.text}
                />

                <Icon
                  name="chevron.down"
                  size={theme.space[3]}
                  tintColor={theme.colors.gray.textLow}
                />
              </View>
            }
            modifiers={[labelStyle('iconOnly')]}
            systemImage={
              field.value === 'image'
                ? 'photo'
                : field.value === 'link'
                  ? 'link'
                  : 'textformat.abc'
            }
          >
            {types.map((item) => (
              <Button
                key={item}
                label={t(item)}
                modifiers={compact([
                  item === field.value && tint(theme.colors.accent.accent),
                ])}
                onPress={() => {
                  if (item !== field.value) {
                    setValue('url', '')
                  }

                  field.onChange(item)
                }}
                systemImage={
                  item === 'image'
                    ? 'photo'
                    : item === 'link'
                      ? 'link'
                      : 'textformat.abc'
                }
              />
            ))}
          </Menu>
        </Host>
      )}
    />
  )
}

const styles = StyleSheet.create((theme) => ({
  main: {
    alignItems: 'center',
    backgroundColor: theme.colors.accent.ui,
    borderCurve: 'continuous',
    borderRadius: theme.radius[4],
    flexDirection: 'row',
    gap: theme.space[1],
    height: theme.space[6],
    justifyContent: 'center',
    paddingHorizontal: theme.space[2],
  },
}))
