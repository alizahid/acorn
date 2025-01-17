import { SectionList } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Pressable } from '~/components/common/pressable'
import { Text } from '~/components/common/text'
import { View } from '~/components/common/view'
import { useList } from '~/hooks/list'
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

export default function Screen() {
  const t = useTranslations('screen.settings.themes')

  const { theme, update } = usePreferences()

  const { styles } = useStyles(stylesheet)

  const listProps = useList()

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
          id: 'acorn-light',
          label: t('light.acorn'),
        },
        {
          color: 'ruby',
          id: 'ruby-light',
          label: t('light.ruby'),
        },
        {
          color: 'plum',
          id: 'plum-light',
          label: t('light.plum'),
        },
        {
          color: 'indigo',
          id: 'indigo-light',
          label: t('light.indigo'),
        },
        {
          color: 'jade',
          id: 'jade-light',
          label: t('light.jade'),
        },
      ],
      title: t('light.title'),
    },
    {
      data: [
        {
          color: 'orange',
          id: 'acorn-dark',
          label: t('dark.acorn'),
        },
        {
          color: 'ruby',
          id: 'ruby-dark',
          label: t('dark.ruby'),
        },
        {
          color: 'plum',
          id: 'plum-dark',
          label: t('dark.plum'),
        },
        {
          color: 'indigo',
          id: 'indigo-dark',
          label: t('dark.indigo'),
        },
        {
          color: 'jade',
          id: 'jade-dark',
          label: t('dark.jade'),
        },
      ],
      title: t('dark.title'),
    },
  ] as const

  return (
    <SectionList<Item, Section>
      {...listProps}
      renderItem={({ item }) => (
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
      )}
      renderSectionFooter={() => <View height="4" />}
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
}))
