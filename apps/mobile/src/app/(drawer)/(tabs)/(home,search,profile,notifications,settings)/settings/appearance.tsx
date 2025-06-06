import { SymbolView } from 'expo-symbols'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Menu, type MenuItem } from '~/components/common/menu'
import { Slider } from '~/components/common/slider'
import { View } from '~/components/common/view'
import { useList } from '~/hooks/list'
import { type Font, fonts } from '~/lib/fonts'
import { type PreferencesPayload, usePreferences } from '~/stores/preferences'
import { type Theme } from '~/styles/themes'
import {
  type ColorToken,
  typography,
  type TypographyToken,
} from '~/styles/tokens'

export default function Screen() {
  const t = useTranslations('screen.settings.appearance')

  const {
    blurNavigation,
    colorfulComments,
    feedCompact,
    font,
    fontScaling,
    fontSizeComment,
    fontSizePost,
    largeThumbnails,
    mediaOnRight,
    systemScaling,
    theme: selected,
    themeOled,
    themeTint,
    update,
  } = usePreferences()

  const { styles, theme } = useStyles(stylesheet)

  const listProps = useList()

  return (
    <Menu
      items={(
        [
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
            key: 'colorfulComments',
            label: t('preferences.colorfulComments'),
            value: colorfulComments,
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

          t('fonts.title'),
          {
            key: 'font',
            options: ['basis', 'apercu', 'fold', 'system'],
            value: font,
          },
          {
            key: 'systemScaling',
            label: t('fonts.systemScaling'),
            value: systemScaling,
          },
          {
            key: 'fontScaling',
            value: fontScaling,
          },
          {
            key: 'fontSizePost',
            value: fontSizePost,
          },
          {
            key: 'fontSizeComment',
            value: fontSizeComment,
          },
          null,

          t('themes.title'),
          {
            key: 'theme',
            options: [
              t('themes.auto'),
              {
                color: 'orange',
                key: 'acorn',
              },
              null,

              t('themes.light'),
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
              null,

              t('themes.dark'),
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
            value: selected,
          },
        ] as const
      ).map((item) => {
        if (item === null || typeof item === 'string') {
          return item
        }

        if (item.key === 'font') {
          return {
            hideSelected: true,
            label: t(`fonts.${item.value}`),
            onSelect(value) {
              update({
                font: value as Font,
              })
            },
            options: item.options.map((option) => ({
              label: t(`fonts.${option}`),
              labelStyle: {
                fontFamily: fonts[option],
              },
              value: option,
            })),
            title: t('fonts.title'),
            type: 'options',
            value: item.value,
          } satisfies MenuItem
        }

        if (item.key === 'fontScaling') {
          return function Component() {
            return (
              <Slider
                disabled={systemScaling}
                max={1.2}
                min={0.8}
                onChange={(next) => {
                  update({
                    [item.key]: next,
                  })
                }}
                step={0.1}
                style={styles.slider}
                value={item.value}
              />
            )
          }
        }

        if (item.key === 'theme') {
          return {
            icon: {
              name: item.value.endsWith('-dark')
                ? 'Moon'
                : item.value.endsWith('-light')
                  ? 'Sun'
                  : 'DeviceMobileCamera',
              type: 'icon',
            },
            label: t(`themes.${item.value}`),
            onSelect(value) {
              update({
                theme: value as Theme,
              })
            },
            options: item.options.map((option) => {
              if (option === null || typeof option === 'string') {
                return option
              }

              return {
                label: t(`themes.${option.key}`),
                right: (
                  <View
                    align="center"
                    height="6"
                    justify="center"
                    style={styles.theme(option.color)}
                    width="6"
                  />
                ),
                value: option.key,
              }
            }),
            title: t('themes.title'),
            type: 'options',
            value: item.value,
          } satisfies MenuItem
        }

        if (item.key === 'fontSizePost' || item.key === 'fontSizeComment') {
          return {
            label: t(`fonts.${item.key}`),
            onSelect(value) {
              update({
                [item.key]: value,
              })
            },
            options: Object.keys(typography).map((token) => ({
              hideRight: true,
              label: token,
              right: (
                <SymbolView
                  name={`${token as TypographyToken}.circle.fill`}
                  size={theme.space[5]}
                  tintColor={theme.colors.accent.accent}
                />
              ),
              value: token,
            })),
            type: 'options',
            value: item.value,
          } satisfies MenuItem
        }

        return {
          icon:
            'icon' in item
              ? {
                  name: item.icon,
                  type: 'icon',
                }
              : undefined,
          label: item.label,
          onSelect(value) {
            const payload: Partial<PreferencesPayload> = {
              [item.key]: value,
            }

            if (item.key === 'themeOled' && value && themeTint) {
              payload.themeTint = false
            }

            if (item.key === 'themeTint' && value && themeOled) {
              payload.themeOled = false
            }

            update(payload)
          },
          type: 'switch',
          value: item.value,
        } satisfies MenuItem
      })}
      listProps={listProps}
    />
  )
}

const stylesheet = createStyleSheet((theme) => ({
  item: (selected: boolean) => ({
    backgroundColor: selected ? theme.colors.accent.uiActive : undefined,
  }),
  label: {
    flex: 1,
  },
  slider: {
    marginHorizontal: theme.space[3],
  },
  theme: (color: ColorToken | 'acorn') => ({
    backgroundColor: theme.colors[color === 'acorn' ? 'orange' : color].accent,
    borderCurve: 'continuous',
    borderRadius: theme.space[5],
  }),
}))
