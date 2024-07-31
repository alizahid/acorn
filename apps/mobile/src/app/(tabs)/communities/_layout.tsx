import { Stack } from 'expo-router'
import { useTranslations } from 'use-intl'

import { Header } from '~/components/navigation/header'

export default function Layout() {
  const t = useTranslations('screen.communities')

  return (
    <Stack
      screenOptions={{
        header: (props) => <Header {...props} />,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: t('title'),
        }}
      />
    </Stack>
  )
}
