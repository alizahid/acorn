import { Stack } from 'expo-router'

import { Header } from '~/components/navigation/header'

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        header: (props) => <Header {...props} />,
      }}
    />
  )
}
