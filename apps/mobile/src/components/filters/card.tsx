import { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { IconButton } from '~/components/common/icon/button'
import { TextBox } from '~/components/common/text-box'
import { View } from '~/components/common/view'
import { type FiltersForm } from '~/hooks/filters'
import { space } from '~/styles/tokens'

import { ContextMenu } from '../common/context-menu'

type Props = {
  index: number
  onRemove: (index: number) => void
}

export function FilterCard({ index, onRemove }: Props) {
  const t = useTranslations('component.filters.card')
  const a11y = useTranslations('a11y')

  const { control } = useFormContext<FiltersForm>()

  const [type, setType] = useState<'community' | 'keyword' | 'user'>('keyword')

  return (
    <View direction="row" style={styles.main}>
      <Controller
        control={control}
        name={`filters.${index}.type`}
        render={({ field }) => (
          <ContextMenu
            hitSlop={space[4]}
            label={field.value}
            options={(['keyword', 'community', 'user'] as const).map(
              (item) => ({
                action() {
                  field.onChange(item)

                  setType(item)
                },
                icon: {
                  name:
                    item === 'community'
                      ? 'person.2'
                      : item === 'user'
                        ? 'person'
                        : 'tag',
                  type: 'icon',
                },
                id: item,
                state: item === field.value ? 'on' : undefined,
                title: t(`type.${item}.label`),
              }),
            )}
            tap
          >
            <View align="center" direction="row" gap="2" height="7" px="2">
              <Icon
                name={
                  field.value === 'community'
                    ? 'person.2'
                    : field.value === 'user'
                      ? 'person'
                      : 'tag'
                }
                uniProps={(theme) => ({
                  size: theme.typography[2].lineHeight,
                  tintColor: theme.colors.gray.text,
                })}
              />

              <Icon
                name="chevron.down"
                uniProps={(theme) => ({
                  size: theme.space[4],
                  tintColor: theme.colors.gray.textLow,
                })}
              />
            </View>
          </ContextMenu>
        )}
      />

      <Controller
        control={control}
        name={`filters.${index}.value`}
        render={({ field }) => (
          <TextBox
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect={false}
            onChangeText={field.onChange}
            placeholder={t(`type.${type}.placeholder`)}
            ref={field.ref}
            style={styles.input}
            styleContent={styles.inputContent}
            value={field.value}
          />
        )}
      />

      <IconButton
        color="red"
        icon="trash"
        label={a11y('removeFilter')}
        onPress={() => {
          onRemove(index)
        }}
        size="7"
      />
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  input: {
    flex: 1,
  },
  inputContent: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    borderWidth: 0,
  },
  main: {
    backgroundColor: theme.colors.gray.ui,
    borderCurve: 'continuous',
    borderRadius: theme.radius[3],
  },
}))
