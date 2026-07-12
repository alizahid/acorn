import Component, { type SliderProps } from '@expo/ui/community/slider'
import { useUnistyles } from 'react-native-unistyles'

type Props = SliderProps

export function Slider(props: Props) {
  const { theme } = useUnistyles()

  return (
    <Component {...props} minimumTrackTintColor={theme.colors.accent.accent} />
  )
}
