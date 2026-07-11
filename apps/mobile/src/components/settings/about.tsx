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

export function AboutCard() {
  const t = useTranslations('screen.settings.about')

  const { handleLink } = useLink()

  const links = compact([
    {
      href: 'https://acorn.blue',
      icon: (
        <Icon
          name="compass-fill"
          uniProps={(theme) => ({
            color: theme.colors.accent.contrast,
          })}
        />
      ),
      label: t('links.web'),
    },
    {
      href: 'https://discord.gg/sWzw5GU5RV',
      icon: (
        <Icon
          name="discord-logo-fill"
          uniProps={(theme) => ({
            color: theme.colors.accent.contrast,
          })}
        />
      ),
      label: t('links.discord'),
    },
    {
      href: 'https://github.com/alizahid/acorn',
      icon: (
        <Icon
          name="github-logo-fill"
          uniProps={(theme) => ({
            color: theme.colors.accent.contrast,
          })}
        />
      ),
      label: t('links.github'),
    },
    isTestFlight
      ? {
          href: 'https://buymeacoffee.com/acornblue',
          icon: (
            <Icon
              name="coffee-fill"
              uniProps={(theme) => ({
                color: theme.colors.accent.contrast,
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
    paddingHorizontal: theme.space[4],
  },
  title: {
    color: theme.colors.accent.accent,
  },
}))
