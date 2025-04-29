declare module '*.png' {
  import { type ImageRequireSource } from 'react-native'

  const content: ImageRequireSource

  export default content
}
