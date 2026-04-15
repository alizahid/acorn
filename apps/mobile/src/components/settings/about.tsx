import { isTestFlight } from 'expo-testflight'
import { compact } from 'lodash'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Logo } from '~/components/common/logo'
import { Text } from '~/components/common/text'
import { useLink } from '~/hooks/link'

import { Button } from '../common/button'
import { Icon } from '../common/icon'
import { PhosphorIcon } from '../common/icon/phosphor'

export function AboutCard() {
  const t = useTranslations('screen.settings.about')

  const { handleLink } = useLink()

  const links = compact([
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
      label: t('links.github'),
    },
    isTestFlight
      ? {
          href: 'https://buymeacoffee.com/acornblue',
          icon: (
            <Icon
              name="cup.and.saucer.fill"
              uniProps={(theme) => ({
                tintColor: theme.colors.accent.contrast,
              })}
            />
          ),
          label: t('links.coffee'),
        }
      : null,
  ])

  return (
    <View style={styles.main}>
      <View style={styles.content}>
        <Logo />

        <Text mt="4" size="8" style={styles.title} weight="bold">
          {t('header.title')}
        </Text>

        <Text highContrast={false} mt="2" size="2" weight="medium">
          {t('header.description')}
        </Text>
      </View>

      <View style={styles.footer}>
        {links.map((link) => (
          <Button
            key={link.href}
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
  )
}

const styles = StyleSheet.create((theme) => ({
  content: {
    alignItems: 'center',
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.space[4],
    justifyContent: 'center',
  },
  link: {
    backgroundColor: theme.colors.accent.accent,
    borderCurve: 'continuous',
    borderRadius: theme.space[8],
  },
  main: {
    alignItems: 'center',
    gap: theme.space[6],
    marginHorizontal: theme.space[4],
    marginVertical: theme.space[9],
  },
  title: {
    color: theme.colors.accent.accent,
  },
}))
