import { type MarginProps } from '~/styles/space'

import { Text } from '../text'

type Props = MarginProps & {
  children: string
}

export function MenuLabel({ children, ...props }: Props) {
  return (
    <Text
      highContrast={false}
      mb="2"
      mt="3"
      mx="3"
      size="2"
      weight="medium"
      {...props}
    >
      {children}
    </Text>
  )
}
