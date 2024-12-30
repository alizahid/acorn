import { type BottomTabHeaderProps } from '@react-navigation/bottom-tabs'
import { type NativeStackHeaderProps } from '@react-navigation/native-stack'

import { iPad } from '~/lib/common'

import { Header } from './header'

type Props = NativeStackHeaderProps | BottomTabHeaderProps

export function StackHeader({ options, ...props }: Props) {
  const back = 'back' in props ? Boolean(props.back?.title) : false
  const modal =
    'presentation' in options &&
    options.presentation === (iPad ? 'formSheet' : 'modal')

  return (
    <Header
      back={back}
      left={options.headerLeft?.({
        canGoBack: back,
      })}
      modal={modal}
      right={options.headerRight?.({
        canGoBack: back,
      })}
      title={
        typeof options.headerTitle === 'function'
          ? options.headerTitle({
              children: options.title ?? '',
            })
          : options.title
      }
    />
  )
}
