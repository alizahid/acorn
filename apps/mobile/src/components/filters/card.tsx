import { useRef, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { IconButton } from '~/components/common/icon/button'
import { TextBox } from '~/components/common/text-box'
import { type FiltersForm } from '~/hooks/filters'

import { Icon, type IconName } from '../common/icon'
import { Sheet } from '../common/sheet'

type Item = 'community' | 'keyword' | 'user'

type Props = {
  index: number
  onRemove: (index: number) => void
}

export function FilterCard({ index, onRemove }: Props) {
  const t = useTranslations('component.filters.card')
  const a11y = useTranslations('a11y')

  const { control } = useFormContext<FiltersForm>()

  const sheet = useRef<Sheet>(null)

  const [type, setType] = useState<Item>('keyword')

  return (
    <View style={styles.main}>
      <Controller
        control={control}
        name={`filters.${index}.type`}
        render={({ field }) => (
          <>
            <IconButton
              accessibilityLabel={a11y('aboutCommunity')}
              onPress={() => {
                sheet.current?.present()
              }}
              size="7"
            >
              <Icon name={icons[field.value]} />
            </IconButton>

            <Sheet.Root ref={sheet}>
              <Sheet.Header title={t('type.title')} />

              {(['keyword', 'community', 'user'] as const).map((item) => (
                <Sheet.Item
                  key={item}
                  label={t(`type.${item}.label`)}
                  left={<Icon name={icons[item]} />}
                  onPress={() => {
                    sheet.current?.dismiss()

                    setType(item)

                    field.onChange(item)
                  }}
                  selected={item === field.value}
                />
              ))}

              <Sheet.BottomInset />
            </Sheet.Root>
          </>
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
        accessibilityLabel={a11y('removeFilter')}
        onPress={() => {
          onRemove(index)
        }}
        size="7"
      >
        <Icon
          name="trash"
          uniProps={(theme) => ({
            color: theme.colors.red.accent,
          })}
        />
      </IconButton>
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
  community: 'users-four',
  keyword: 'tag',
  post: 'chat-centered',
  user: 'user',
} as const satisfies Record<string, IconName>
