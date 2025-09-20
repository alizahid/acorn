import { useRef } from 'react'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Pressable } from '~/components/common/pressable'
import { Sheet } from '~/components/common/sheet'
import { Text } from '~/components/common/text'
import { View } from '~/components/common/view'
import { mapColors } from '~/lib/styles'
import { getThemeName } from '~/lib/theme'
import { type Theme } from '~/styles/themes'
import { type ColorToken } from '~/styles/tokens'

import { Icon } from '../common/icon'
import { Menu } from '../common/menu'

type Props = {
  onChange: (value: Theme) => void
  value: Theme
}

export function Themes({ onChange, value }: Props) {
  const t = useTranslations('screen.settings.appearance')

  const modal = useRef<Sheet>(null)

  return (
    <>
      <Menu.Button
        icon={
          <Icon
            name={
              value.endsWith('-dark')
                ? 'moon'
                : value.endsWith('-light')
                  ? 'sun.max'
                  : 'iphone'
            }
          />
        }
        label={t(`themes.${getThemeName(value)}`)}
        onPress={() => {
          modal.current?.present()
        }}
      />

      <Sheet.Root ref={modal}>
        <Sheet.Header title={t('themes.title')} />

        {(
          [
            {
              items: [
                {
                  color: 'orange',
                  key: 'acorn',
                },
                {
                  color: 'ruby',
                  key: 'ruby',
                },
                {
                  color: 'plum',
                  key: 'plum',
                },
                {
                  color: 'indigo',
                  key: 'indigo',
                },
                {
                  color: 'jade',
                  key: 'jade',
                },
              ],
              label: t('themes.auto'),
            },
            {
              items: [
                {
                  color: 'orange',
                  key: 'acorn-light',
                },
                {
                  color: 'ruby',
                  key: 'ruby-light',
                },
                {
                  color: 'plum',
                  key: 'plum-light',
                },
                {
                  color: 'indigo',
                  key: 'indigo-light',
                },
                {
                  color: 'jade',
                  key: 'jade-light',
                },
              ],
              label: t('themes.light'),
            },
            {
              items: [
                {
                  color: 'orange',
                  key: 'acorn-dark',
                },
                {
                  color: 'ruby',
                  key: 'ruby-dark',
                },
                {
                  color: 'plum',
                  key: 'plum-dark',
                },
                {
                  color: 'indigo',
                  key: 'indigo-dark',
                },
                {
                  color: 'jade',
                  key: 'jade-dark',
                },
              ],
              label: t('themes.dark'),
            },
          ] as const
        ).map((section) => (
          <View gap="4" key={section.label} p="4">
            <Text size="2" weight="medium">
              {section.label}
            </Text>

            <View direction="row" gap="4">
              {section.items.map((item) => (
                <Item
                  color={item.color}
                  item={item.key}
                  key={item.key}
                  label={t(`themes.${getThemeName(item.key)}`)}
                  onPress={() => {
                    onChange?.(item.key)
                  }}
                  value={value}
                />
              ))}
            </View>
          </View>
        ))}
      </Sheet.Root>
    </>
  )
}

type ItemProps = {
  color: ColorToken
  item: Theme
  label: string
  onPress?: () => void
  value?: Theme
}

function Item({ color, item, label, onPress, value }: ItemProps) {
  styles.useVariants({
    color,
  })

  return (
    <Pressable
      align="center"
      height="8"
      justify="center"
      label={label}
      onPress={onPress}
      style={styles.theme}
      width="8"
    >
      {item === value ? (
        <Icon
          name="checkmark"
          uniProps={(theme) => ({
            size: theme.space[4],
            tintColor: theme.colors.accent.contrast,
          })}
          weight="black"
        />
      ) : null}
    </Pressable>
  )
}

const styles = StyleSheet.create((theme) => ({
  theme: {
    borderCurve: 'continuous',
    borderRadius: theme.space[5],
    variants: {
      color: mapColors((token) => ({
        backgroundColor: theme.colors[token].accent,
      })),
    },
  },
}))
