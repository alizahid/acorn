import Menu from '@expo/ui/community/menu'
import { type SFSymbol } from 'expo-symbols'
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
          <Menu
            actions={[
              {
                id: 'keyword',
                image: icons.keyword,
                state: field.value === 'keyword' ? 'on' : 'off',
                title: t('type.keyword.label'),
              },
              {
                id: 'community',
                image: icons.community,
                state: field.value === 'community' ? 'on' : 'off',
                title: t('type.community.label'),
              },
              {
                id: 'user',
                image: icons.user,
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
              icon={icons[field.value]}
              label={a11y('aboutCommunity')}
              size="7"
            />
          </Menu>
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

const icons = {
  community: 'person.2',
  keyword: 'tag',
  post: 'text.bubble',
  user: 'person',
} as const satisfies Record<string, SFSymbol>
