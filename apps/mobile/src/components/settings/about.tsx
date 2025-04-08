import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Logo } from '~/components/common/logo'
import { Text } from '~/components/common/text'
import { View } from '~/components/common/view'
import { useLink } from '~/hooks/link'

import { IconButton } from '../common/icon-button'

export function AboutCard() {
  const t = useTranslations('screen.settings.about')

  const { handleLink } = useLink()

  const { styles, theme } = useStyles(stylesheet)

  const links = [
    {
      href: 'https://acorn.blue',
      icon: 'Compass',
      key: 'web',
      label: 'Website',
    },
    {
      href: 'https://discord.gg/sWzw5GU5RV',
      icon: 'DiscordLogo',
      key: 'discord',
      label: 'Discord',
    },
    {
      href: 'https://github.com/alizahid/acorn',
      icon: 'GitHubLogo',
      key: 'github',
      label: 'GitHub',
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
            <IconButton
              contrast
              hitSlop={theme.space[2]}
              icon={{
                name: link.icon,
                weight: 'fill',
              }}
              key={link.key}
              label={link.label}
              onPress={() => {
                void handleLink(link.href)
              }}
              style={styles.link}
            />
          ))}
        </View>
      </View>
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  link: {
    backgroundColor: theme.colors.accent.accent,
    borderCurve: 'continuous',
    borderRadius: theme.space[8],
  },
  title: {
    color: theme.colors.accent.accent,
  },
}))
