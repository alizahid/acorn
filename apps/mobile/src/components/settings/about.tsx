import * as Updates from 'expo-updates'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Logo } from '~/components/common/logo'
import { Text } from '~/components/common/text'
import { View } from '~/components/common/view'
import { HeaderButton } from '~/components/navigation/header-button'
import { useLink } from '~/hooks/link'

import { Updater } from './updater'

export function AboutCard() {
  const t = useTranslations('screen.settings.about')

  const { handleLink } = useLink()

  const { styles, theme } = useStyles(stylesheet)

  const links = [
    {
      href: 'https://acorn.blue',
      icon: 'Compass',
      key: 'web',
    },
    {
      href: 'https://discord.gg/sWzw5GU5RV',
      icon: 'DiscordLogo',
      key: 'discord',
    },
    {
      href: 'https://github.com/alizahid/acorn',
      icon: 'GitHubLogo',
      key: 'github',
    },
  ] as const

  return (
    <View align="center" gap="6" mx="4" my="9">
      <View gap="6">
        <View align="center">
          <Logo />

          <Text mt="4" size="8" style={styles.title} weight="bold">
            {t('header.title')}
          </Text>

          <Text highContrast={false} mt="2" size="2" weight="medium">
            {t('header.description')}
          </Text>
        </View>

        <View
          align="center"
          direction="row"
          gap="4"
          justify="center"
          wrap="wrap"
        >
          {links.map((link) => (
            <HeaderButton
              contrast
              hitSlop={theme.space[2]}
              icon={link.icon}
              key={link.key}
              onPress={() => {
                void handleLink(link.href)
              }}
              style={styles.link}
              weight="fill"
            />
          ))}
        </View>
      </View>

      <View direction="row" gap="4">
        <Text highContrast={false} variant="mono" weight="medium">
          {Updates.runtimeVersion}
        </Text>

        {Updates.updateId ? (
          <Text highContrast={false} variant="mono">
            {Updates.updateId.split('-').pop()}
          </Text>
        ) : null}
      </View>

      <Updater />
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  link: {
    backgroundColor: theme.colors.accent.a9,
    borderCurve: 'continuous',
    borderRadius: theme.space[8],
  },
  title: {
    color: theme.colors.accent.a9,
  },
}))
