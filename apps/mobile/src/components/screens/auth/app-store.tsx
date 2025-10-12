import { StatusBar } from 'expo-status-bar'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Button } from '~/components/common/button'
import { PhosphorIcon } from '~/components/common/icon/phosphor'
import { Logo } from '~/components/common/logo'
import { Text } from '~/components/common/text'
import { View } from '~/components/common/view'
import { useSignIn } from '~/hooks/mutations/auth/sign-in-app-store'
import { glass, iPhone } from '~/lib/common'

export function Auth() {
  const t = useTranslations('screen.auth.signIn')

  const { isPending, signIn } = useSignIn()

  return (
    <View align="center" flexGrow={1} gap="9" justify="center" px="4" py="9">
      {iPhone && !glass ? <StatusBar style="light" /> : null}

      <View align="center">
        <Logo />

        <Text mt="4" size="8" style={styles.title} weight="bold">
          {t('title')}
        </Text>

        <Text highContrast={false} mt="2" size="2" weight="medium">
          {t('description')}
        </Text>
      </View>

      <Button
        label={t('form.action.reddit')}
        left={
          <PhosphorIcon
            name="RedditLogo"
            uniProps={(theme) => ({
              color: theme.colors.accent.contrast,
            })}
            weight="fill"
          />
        }
        loading={isPending}
        onPress={() => {
          signIn()
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  error: {
    backgroundColor: theme.colors.red.accent,
    borderRadius: theme.radius[4],
  },
  title: {
    color: theme.colors.accent.accent,
  },
}))
