import * as Updates from 'expo-updates'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { Logo } from '~/components/common/logo'
import { Pressable } from '~/components/common/pressable'
import { Text } from '~/components/common/text'
import { View } from '~/components/common/view'
import { useLink } from '~/hooks/link'

export function SettingsAboutScreen() {
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
      href: 'https://reddit.com/r/acornblue',
      icon: 'RedditLogo',
      key: 'reddit',
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
    <View align="center" flexGrow={1} gap="6" justify="center" p="4">
      <View align="center">
        <Logo />

        <Text mt="4" size="8" style={styles.title} weight="bold">
          {t('header.title')}
        </Text>

        <Text highContrast={false} mt="2" size="4" weight="medium">
          {t('header.description')}
        </Text>
      </View>

      <View align="center" direction="row" gap="4" justify="center" wrap="wrap">
        {links.map((link) => (
          <Pressable
            direction="row"
            gap="2"
            hitSlop={theme.space[4]}
            justify="center"
            key={link.key}
            onPress={() => {
              void handleLink(link.href)
            }}
            px="3"
            py="2"
            style={styles.link}
          >
            <Icon
              color={theme.colors.accent.a9}
              name={link.icon}
              weight="duotone"
            />

            <Text color="accent" highContrast weight="medium">
              {t(`links.${link.key}`)}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text highContrast={false} variant="mono" weight="medium">
        {Updates.runtimeVersion}
      </Text>

      {Updates.updateId ? (
        <Text highContrast={false} size="1" variant="mono">
          {Updates.updateId}
        </Text>
      ) : null}
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  link: {
    backgroundColor: theme.colors.accent.a3,
    borderCurve: 'continuous',
    borderRadius: 100,
    width: '40%',
  },
  title: {
    color: theme.colors.accent.a9,
  },
}))
