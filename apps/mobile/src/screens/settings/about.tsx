import * as Updates from 'expo-updates'
import { useRef, useState } from 'react'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Button } from '~/components/common/button'
import { Logo } from '~/components/common/logo'
import { Text } from '~/components/common/text'
import { View } from '~/components/common/view'
import { HeaderButton } from '~/components/navigation/header-button'
import { useLink } from '~/hooks/link'

export function SettingsAboutScreen() {
  const t = useTranslations('screen.settings.about')

  const updates = Updates.useUpdates()

  const { handleLink } = useLink()

  const { styles, theme } = useStyles(stylesheet)

  const timer = useRef<NodeJS.Timeout>()

  const [nothing, setNothing] = useState<boolean>()

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
    <View align="center" flexGrow={1} gap="9" justify="center" p="4">
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

      <Button
        label={t(
          `updates.${nothing ? 'nothing' : updates.isUpdatePending ? 'apply' : updates.isUpdateAvailable ? 'download' : 'check'}`,
        )}
        loading={updates.isChecking || updates.isDownloading}
        onPress={async () => {
          setNothing(false)

          if (updates.isUpdatePending) {
            void Updates.reloadAsync()
          } else if (updates.isUpdateAvailable) {
            void Updates.fetchUpdateAsync()
          } else {
            if (timer.current) {
              clearTimeout(timer.current)
            }

            const update = await Updates.checkForUpdateAsync()

            setNothing(!update.isAvailable || !update.isRollBackToEmbedded)

            timer.current = setTimeout(() => {
              setNothing(undefined)
            }, 3_000)
          }
        }}
      />
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
