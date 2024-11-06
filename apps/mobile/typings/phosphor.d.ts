import { type SvgProps as DefaultSvgProps } from 'react-native-svg'

declare module 'react-native-svg' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- go away
  interface SvgProps extends DefaultSvgProps {
    className?: string
  }
}
