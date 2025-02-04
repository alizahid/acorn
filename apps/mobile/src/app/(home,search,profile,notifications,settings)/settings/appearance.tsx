import { FlashList } from '@shopify/flash-list'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { Switch } from '~/components/common/switch'
import { Text } from '~/components/common/text'
import { View } from '~/components/common/view'
import { SheetItem } from '~/components/sheets/item'
import { useList } from '~/hooks/list'
import { type PreferencesPayload, usePreferences } from '~/stores/preferences'
import { type ColorToken } from '~/styles/tokens'

export default function Screen() {
  const t = useTranslations('screen.settings.appearance')

  const {
    blurNavigation,
    coloredComments,
    feedCompact,
    largeThumbnails,
    mediaOnRight,
    theme: selected,
    themeOled,
    themeTint,
    update,
  } = usePreferences()

  const { styles, theme } = useStyles(stylesheet)

  const listProps = useList()

  const data = [
    t('preferences.title'),
    {
      icon: 'TelevisionSimple',
      key: 'themeOled',
      label: t('preferences.themeOled'),
      value: themeOled,
    },
    {
      icon: 'PaintRoller',
      key: 'themeTint',
      label: t('preferences.themeTint'),
      value: themeTint,
    },
    {
      icon: 'Drop',
      key: 'blurNavigation',
      label: t('preferences.blurNavigation'),
      value: blurNavigation,
    },
    {
      icon: 'PaintBrush',
      key: 'coloredComments',
      label: t('preferences.coloredComments'),
      value: coloredComments,
    },
    null,

    t('compact.title'),
    {
      icon: 'Rows',
      key: 'feedCompact',
      label: t('compact.feedCompact'),
      value: feedCompact,
    },
    {
      icon: 'ArrowsOut',
      key: 'largeThumbnails',
      label: t('compact.largeThumbnails'),
      value: largeThumbnails,
    },
    {
      icon: 'Image',
      key: 'mediaOnRight',
      label: t('compact.mediaOnRight'),
      value: mediaOnRight,
    },
    null,

    t('themes.title'),
    {
      color: 'orange',
      key: 'acorn',
      label: t('themes.acorn'),
    },
    null,

    t('themes.light'),
    {
      color: 'orange',
      key: 'acorn-light',
      label: t('themes.acorn'),
    },
    {
      color: 'ruby',
      key: 'ruby-light',
      label: t('themes.ruby'),
    },
    {
      color: 'plum',
      key: 'plum-light',
      label: t('themes.plum'),
    },
    {
      color: 'indigo',
      key: 'indigo-light',
      label: t('themes.indigo'),
    },
    {
      color: 'jade',
      key: 'jade-light',
      label: t('themes.jade'),
    },
    null,

    t('themes.dark'),
    {
      color: 'orange',
      key: 'acorn-dark',
      label: t('themes.acorn'),
    },
    {
      color: 'ruby',
      key: 'ruby-dark',
      label: t('themes.ruby'),
    },
    {
      color: 'plum',
      key: 'plum-dark',
      label: t('themes.plum'),
    },
    {
      color: 'indigo',
      key: 'indigo-dark',
      label: t('themes.indigo'),
    },
    {
      color: 'jade',
      key: 'jade-dark',
      label: t('themes.jade'),
    },
  ] as const

  return (
    <FlashList
      {...listProps}
      data={data}
      estimatedItemSize={48}
      getItemType={(item) => {
        if (item === null) {
          return 'separator'
        }

        if (typeof item === 'string') {
          return 'header'
        }

        if ('color' in item) {
          return 'theme'
        }

        if ('title' in item) {
          return 'title'
        }

        return 'preference'
      }}
      renderItem={({ item }) => {
        if (item === null) {
          return <View height="4" />
        }

        if (typeof item === 'string') {
          return (
            <Text
              highContrast={false}
              mb="2"
              mt="3"
              mx="3"
              size="2"
              weight="medium"
            >
              {item}
            </Text>
          )
        }

        if ('color' in item) {
          return (
            <SheetItem
              label={item.label}
              onPress={() => {
                update({
                  theme: item.key,
                })
              }}
              right={
                <View
                  align="center"
                  height="6"
                  justify="center"
                  style={styles.icon(item.color)}
                  width="6"
                />
              }
              selected={item.key === selected}
            />
          )
        }

        return (
          <View align="center" direction="row" gap="3" height="8" px="3">
            <Icon
              color={theme.colors.accent.accent}
              name={item.icon}
              weight="duotone"
            />

            <Text lines={1} style={styles.label} weight="medium">
              {item.label}
            </Text>

            <Switch
              onChange={(next) => {
                const payload: Partial<PreferencesPayload> = {
                  [item.key]: next,
                }

                if (item.key === 'themeOled' && next && themeTint) {
                  payload.themeTint = false
                }

                if (item.key === 'themeTint' && next && themeOled) {
                  payload.themeOled = false
                }

                update(payload)
              }}
              value={item.value}
            />
          </View>
        )
      }}
    />
  )
}

const stylesheet = createStyleSheet((theme) => ({
  header: {
    backgroundColor: theme.colors.gray.bgAlt,
  },
  icon: (color: ColorToken | 'acorn') => ({
    backgroundColor: theme.colors[color === 'acorn' ? 'orange' : color].accent,
    borderCurve: 'continuous',
    borderRadius: theme.space[5],
  }),
  item: (selected: boolean) => ({
    backgroundColor: selected ? theme.colors.accent.uiActive : undefined,
  }),
  label: {
    flex: 1,
  },
}))
