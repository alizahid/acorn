import { type NativeStackHeaderProps } from '@react-navigation/native-stack'

import { Header } from './header'

type Props = NativeStackHeaderProps

export function StackHeader({ options, ...props }: Props) {
  const back = 'back' in props ? Boolean(props.back?.title) : false
  const modal =
    'presentation' in options &&
    (options.presentation === 'modal' || options.presentation === 'formSheet')

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
      sticky={!modal && options.headerTransparent !== false}
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
