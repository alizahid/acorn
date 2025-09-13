import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Logo } from '~/components/common/logo'
import { Text } from '~/components/common/text'
import { View } from '~/components/common/view'
import { useLink } from '~/hooks/link'

import { Button } from '../common/button'
import { Icon } from '../common/icon'
import { PhosphorIcon } from '../common/icon/phosphor'

export function AboutCard() {
  const t = useTranslations('screen.settings.about')

  const { handleLink } = useLink()

  const links = [
    {
      href: 'https://acorn.blue',
      icon: (
        <PhosphorIcon
          name="Compass"
          uniProps={(theme) => ({
            color: theme.colors.accent.contrast,
          })}
          weight="fill"
        />
      ),
      key: 'web',
      label: t('links.web'),
    },
    {
      href: 'https://discord.gg/sWzw5GU5RV',
      icon: (
        <PhosphorIcon
          name="DiscordLogo"
          uniProps={(theme) => ({
            color: theme.colors.accent.contrast,
          })}
          weight="fill"
        />
      ),
      key: 'discord',
      label: t('links.discord'),
    },
    {
      href: 'https://github.com/alizahid/acorn',
      icon: (
        <PhosphorIcon
          name="GithubLogo"
          uniProps={(theme) => ({
            color: theme.colors.accent.contrast,
          })}
          weight="fill"
        />
      ),
      key: 'github',
      label: t('links.github'),
    },
    {
      href: 'https://buymeacoffee.com/acornblue',
      icon: (
        <Icon
          name="cup.and.saucer.fill"
          uniProps={(theme) => ({
            tintColor: theme.colors.accent.contrast,
          })}
        />
      ),
      key: 'coffee',
      label: t('links.coffee'),
    },
  ] as const

  return (
    <View align="center" gap="6" mx="4" my="9">
      <View align="center" gap="6">
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
            <Button
              key={link.key}
              label={link.label}
              left={link.icon}
              onPress={() => {
                handleLink(link.href)
              }}
              style={styles.link}
            />
          ))}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  link: {
    backgroundColor: theme.colors.accent.accent,
    borderCurve: 'continuous',
    borderRadius: theme.space[8],
  },
  title: {
    color: theme.colors.accent.accent,
  },
}))
