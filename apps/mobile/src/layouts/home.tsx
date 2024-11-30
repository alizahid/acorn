import { Stack } from 'expo-router'
import { useTranslations } from 'use-intl'

import { StackHeader } from '~/components/navigation/stack-header'

export function HomeLayout() {
  const t = useTranslations('screen')

  return (
    <Stack
      screenOptions={{
        fullScreenGestureEnabled: true,
        header: (props) => <StackHeader {...props} />,
      }}
    >
      <Stack.Screen name="index" />

      <Stack.Screen
        name="communities/[name]/index"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="communities/[name]/search"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="users/[name]/index"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="posts/[id]/reply"
        options={{
          presentation: 'modal',
          title: t('posts.reply.title'),
        }}
      />
    </Stack>
  )
}
