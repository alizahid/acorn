import { SectionList } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Pressable } from '~/components/common/pressable'
import { Text } from '~/components/common/text'
import { View } from '~/components/common/view'
import { listProps } from '~/lib/common'
import { usePreferences } from '~/stores/preferences'
import { type Theme } from '~/styles/themes'
import { type ColorToken } from '~/styles/tokens'

type Item = {
  color: ColorToken
  id: Theme
  label: string
}

type Section = {
  title: string
}

export function SettingsThemesScreen() {
  const t = useTranslations('screen.settings.themes')

  const { theme, update } = usePreferences()

  const { styles } = useStyles(stylesheet)

  const data = [
    {
      data: [
        {
          color: 'orange',
          id: 'acorn',
          label: t('auto.acorn'),
        },
      ],
      title: t('auto.title'),
    },
    {
      data: [
        {
          color: 'orange',
          id: 'acornLight',
          label: t('light.acorn'),
        },
        {
          color: 'ruby',
          id: 'rubyLight',
          label: t('light.ruby'),
        },
        {
          color: 'plum',
          id: 'plumLight',
          label: t('light.plum'),
        },
        {
          color: 'indigo',
          id: 'indigoLight',
          label: t('light.indigo'),
        },
        {
          color: 'jade',
          id: 'jadeLight',
          label: t('light.jade'),
        },
      ],
      title: t('light.title'),
    },
    {
      data: [
        {
          color: 'orange',
          id: 'acornDark',
          label: t('dark.acorn'),
        },
        {
          color: 'ruby',
          id: 'rubyDark',
          label: t('dark.ruby'),
        },
        {
          color: 'plum',
          id: 'plumDark',
          label: t('dark.plum'),
        },
        {
          color: 'indigo',
          id: 'indigoDark',
          label: t('dark.indigo'),
        },
        {
          color: 'jade',
          id: 'jadeDark',
          label: t('dark.jade'),
        },
      ],
      title: t('dark.title'),
    },
  ] as const

  return (
    <SectionList<Item, Section>
      {...listProps}
      renderItem={({ item }) => {
        return (
          <Pressable
            align="center"
            direction="row"
            gap="4"
            onPress={() => {
              update({
                theme: item.id,
              })
            }}
            px="4"
            py="3"
            style={styles.item(item.id === theme)}
          >
            <View
              align="center"
              height="6"
              justify="center"
              style={styles.icon(item.color)}
              width="6"
            />

            <Text weight="medium">{item.label}</Text>
          </Pressable>
        )
      }}
      renderSectionHeader={({ section }) => (
        <View px="4" py="2" style={styles.header}>
          <Text weight="medium">{section.title}</Text>
        </View>
      )}
      sections={data}
      stickySectionHeadersEnabled={false}
    />
  )
}

const stylesheet = createStyleSheet((theme) => ({
  header: {
    backgroundColor: theme.colors.gray.a2,
  },
  icon: (color: ColorToken | 'acorn') => ({
    backgroundColor: theme.colors[color === 'acorn' ? 'orange' : color].a9,
    borderCurve: 'continuous',
    borderRadius: theme.space[5],
  }),
  item: (selected: boolean) => ({
    backgroundColor: selected ? theme.colors.accent.a5 : undefined,
  }),
}))
