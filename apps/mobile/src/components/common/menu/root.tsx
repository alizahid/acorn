import { type ReactNode } from 'react'

import { type ViewStyleProps } from '~/styles/view'

import { View } from '../view'

type Props = ViewStyleProps & {
  children: ReactNode
}

export function MenuRoot({ children, ...props }: Props) {
  return (
    <View py="1" {...props}>
      {children}
    </View>
  )
}
