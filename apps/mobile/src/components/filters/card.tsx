import { Button, Host, Menu } from '@expo/ui/swift-ui'
import { labelStyle, tint } from '@expo/ui/swift-ui/modifiers'
import { compact } from 'lodash'
import { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { View } from 'react-native'
import { StyleSheet, useUnistyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { IconButton } from '~/components/common/icon/button'
import { TextBox } from '~/components/common/text-box'
import { type FiltersForm } from '~/hooks/filters'

import { Icon } from '../common/icon'

type Item = 'community' | 'keyword' | 'user'

type Props = {
  index: number
  onRemove: (index: number) => void
}

export function FilterCard({ index, onRemove }: Props) {
  const t = useTranslations('component.filters.card')
  const a11y = useTranslations('a11y')

  const { theme } = useUnistyles()

  const { control } = useFormContext<FiltersForm>()

  const [type, setType] = useState<Item>('keyword')

  return (
    <View style={styles.main}>
      <Controller
        control={control}
        name={`filters.${index}.type`}
        render={({ field }) => (
          <Host colorScheme={theme.variant} matchContents>
            <Menu
              label={
                <View style={styles.item}>
                  <Icon
                    name={
                      field.value === 'community'
                        ? 'person.2'
                        : field.value === 'user'
                          ? 'person'
                          : 'tag'
                    }
                    size={theme.typography[2].lineHeight}
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
                field.value === 'community'
                  ? 'person.2'
                  : field.value === 'user'
                    ? 'person'
                    : 'tag'
              }
            >
              {(['keyword', 'community', 'user'] as const).map((item) => (
                <Button
                  key={item}
                  label={t(`type.${item}.label`)}
                  modifiers={compact([
                    item === field.value && tint(theme.colors.accent.accent),
                  ])}
                  onPress={() => {
                    field.onChange(item)

                    setType(item)
                  }}
                  systemImage={
                    item === 'community'
                      ? 'person.2'
                      : item === 'user'
                        ? 'person'
                        : 'tag'
                  }
                />
              ))}
            </Menu>
          </Host>
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
    backgroundColor: 'transparent',
    borderRadius: 0,
    borderWidth: 0,
    flex: 1,
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.space[1],
    height: theme.space[7],
    justifyContent: 'center',
    paddingHorizontal: theme.space[2],
  },
  main: {
    backgroundColor: theme.colors.gray.ui,
    borderCurve: 'continuous',
    borderRadius: theme.radius[3],
    flexDirection: 'row',
  },
}))
