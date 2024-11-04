import { useStyles } from 'react-native-unistyles'

import { Icon, type IconName, type IconWeight } from '~/components/common/icon'
import { Pressable } from '~/components/common/pressable'

type Props = {
  color?: string
  icon: IconName
  onPress: () => void
  weight?: IconWeight
}

export function FooterButton({ color, icon, onPress, weight }: Props) {
  const { theme } = useStyles()

  return (
    <Pressable
      align="center"
      height="6"
      hitSlop={theme.space[4]}
      justify="center"
      onPress={onPress}
      width="6"
    >
      <Icon color={color} name={icon} size={theme.space[5]} weight={weight} />
    </Pressable>
  )
}
