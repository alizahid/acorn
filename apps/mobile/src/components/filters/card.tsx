import { MenuView } from '@react-native-menu/menu'
import { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { StyleSheet, useUnistyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { IconButton } from '~/components/common/icon/button'
import { TextBox } from '~/components/common/text-box'
import { View } from '~/components/common/view'
import { type FiltersForm } from '~/hooks/filters'

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
    <View direction="row" style={styles.main}>
      <Controller
        control={control}
        name={`filters.${index}.type`}
        render={({ field }) => (
          <MenuView
            actions={(['keyword', 'community', 'user'] as const).map(
              (item) => ({
                id: item,
                image:
                  item === 'community'
                    ? 'person.2'
                    : item === 'user'
                      ? 'person'
                      : 'tag',
                imageColor: theme.colors.gray.text,
                state: item === field.value ? 'on' : undefined,
                title: t(`type.${item}.label`),
                titleColor: theme.colors.gray.text,
              }),
            )}
            onPressAction={(event) => {
              field.onChange(event.nativeEvent.event)

              setType(event.nativeEvent.event as Item)
            }}
            shouldOpenOnLongPress={false}
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
                uniProps={($theme) => ({
                  size: $theme.typography[2].lineHeight,
                  tintColor: $theme.colors.gray.text,
                })}
              />

              <Icon
                name="chevron.down"
                uniProps={($theme) => ({
                  size: $theme.space[4],
                  tintColor: $theme.colors.gray.textLow,
                })}
              />
            </View>
          </MenuView>
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
  main: {
    backgroundColor: theme.colors.gray.ui,
    borderCurve: 'continuous',
    borderRadius: theme.radius[3],
  },
}))
