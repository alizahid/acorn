import {
  forwardRef,
  type ReactNode,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { Modal as Base, type StyleProp, type ViewStyle } from 'react-native'

import { Backdrop } from './backdrop'
import { Content } from './content'

export type Modal = {
  close: () => void
  open: () => void
}

type Props = {
  children: ReactNode
  inset?: boolean
  style?: StyleProp<ViewStyle>
  title?: string
}

export const Modal = forwardRef<Modal, Props>(function Component(
  { children, inset, style, title },
  ref,
) {
  useImperativeHandle(ref, () => ({
    close() {
      onClose()
    },
    open() {
      setVisible(true)
    },
  }))

  const backdrop = useRef<Backdrop>(null)
  const content = useRef<Content>(null)
  const timeout = useRef<NodeJS.Timeout>()

  const [visible, setVisible] = useState(false)

  const onClose = useCallback(() => {
    backdrop.current?.hide()
    content.current?.hide()

    if (timeout.current) {
      clearTimeout(timeout.current)
    }

    timeout.current = setTimeout(() => {
      setVisible(false)
    }, 250)
  }, [])

  return (
    <Base transparent visible={visible}>
      <Backdrop onClose={onClose} ref={backdrop} visible={visible} />

      <Content
        inset={inset}
        onClose={onClose}
        ref={content}
        style={style}
        title={title}
        visible={visible}
      >
        {children}
      </Content>
    </Base>
  )
})
