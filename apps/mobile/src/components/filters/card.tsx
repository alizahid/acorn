import { type BottomSheetModal } from '@gorhom/bottom-sheet'
import { useRef, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Keyboard } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { IconButton } from '~/components/common/icon-button'
import { Pressable } from '~/components/common/pressable'
import { TextBox } from '~/components/common/text-box'
import { View } from '~/components/common/view'
import { SheetItem } from '~/components/sheets/item'
import { SheetModal } from '~/components/sheets/modal'
import { type FiltersForm } from '~/hooks/filters'

type Props = {
  index: number
  onRemove: (index: number) => void
}

export function FilterCard({ index, onRemove }: Props) {
  const t = useTranslations('component.filters.card')

  const { styles, theme } = useStyles(stylesheet)

  const sheet = useRef<BottomSheetModal>(null)

  const { control } = useFormContext<FiltersForm>()

  const [type, setType] = useState<'community' | 'keyword' | 'user'>('keyword')

  return (
    <View direction="row" style={styles.main}>
      <Controller
        control={control}
        name={`filters.${index}.type`}
        render={({ field }) => (
          <>
            <Pressable
              align="center"
              direction="row"
              gap="2"
              height="7"
              hitSlop={theme.space[4]}
              onPress={() => {
                Keyboard.dismiss()

                sheet.current?.present()
              }}
              px="2"
            >
              <Icon
                color={theme.colors.gray.text}
                name={
                  field.value === 'community'
                    ? 'UsersFour'
                    : field.value === 'user'
                      ? 'User'
                      : 'Tag'
                }
                size={theme.typography[2].lineHeight}
                weight="duotone"
              />

              <Icon
                color={theme.colors.gray.textLow}
                name="CaretDown"
                size={theme.space[4]}
                weight="bold"
              />
            </Pressable>

            <SheetModal ref={sheet} title={t('type.title')}>
              {(['keyword', 'community', 'user'] as const).map((item) => (
                <SheetItem
                  icon={{
                    name:
                      item === 'community'
                        ? 'UsersFour'
                        : item === 'user'
                          ? 'User'
                          : 'Tag',
                    type: 'icon',
                  }}
                  key={item}
                  label={t(`type.${item}.label`)}
                  onPress={() => {
                    field.onChange(item)

                    setType(item)

                    sheet.current?.close()
                  }}
                  selected={item === field.value}
                />
              ))}
            </SheetModal>
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
            styleContent={styles.inputContent}
            value={field.value}
          />
        )}
      />

      <IconButton
        icon={{
          color: 'red',
          name: 'Trash',
          weight: 'duotone',
        }}
        onPress={() => {
          onRemove(index)
        }}
        size="7"
      />
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  input: {
    flex: 1,
  },
  inputContent: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    borderWidth: 0,
  },
  main: {
    backgroundColor: theme.colors.gray.bgAlt,
    borderCurve: 'continuous',
    borderRadius: theme.radius[3],
  },
}))
