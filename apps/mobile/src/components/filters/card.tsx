import MenuView from '@expo/ui/community/menu'
import { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { IconButton } from '~/components/common/icon/button'
import { TextBox } from '~/components/common/text-box'
import { type FiltersForm } from '~/hooks/filters'

type Item = 'community' | 'keyword' | 'user'

type Props = {
  index: number
  onRemove: (index: number) => void
}

export function FilterCard({ index, onRemove }: Props) {
  const t = useTranslations('component.filters.card')
  const a11y = useTranslations('a11y')

  const { control } = useFormContext<FiltersForm>()

  const [type, setType] = useState<Item>('keyword')

  return (
    <View style={styles.main}>
      <Controller
        control={control}
        name={`filters.${index}.type`}
        render={({ field }) => (
          <MenuView
            actions={[
              {
                id: 'keyword',
                image: 'tag',
                state: field.value === 'keyword' ? 'on' : 'off',
                title: t('type.keyword.label'),
              },
              {
                id: 'community',
                image: 'person.2',
                state: field.value === 'community' ? 'on' : 'off',
                title: t('type.community.label'),
              },
              {
                id: 'user',
                image: 'person',
                state: field.value === 'user' ? 'on' : 'off',
                title: t('type.user.label'),
              },
            ]}
            onPressAction={(event) => {
              const next = event.nativeEvent.event as Item

              setType(next)

              field.onChange(next)
            }}
          >
            <IconButton
              icon={
                field.value === 'community'
                  ? 'person.2'
                  : field.value === 'user'
                    ? 'person'
                    : 'tag'
              }
              label={a11y('aboutCommunity')}
              size="7"
            />
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
    flexDirection: 'row',
  },
}))
