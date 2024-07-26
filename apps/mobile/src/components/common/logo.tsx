import { type StyleProp, type ViewStyle } from 'react-native'
import { Path, Svg } from 'react-native-svg'

type Props = {
  size?: number
  style?: StyleProp<ViewStyle>
}

export function Logo({ size = 64, style }: Props) {
  return (
    <Svg
      clipRule="evenodd"
      fillRule="evenodd"
      height={size}
      style={style}
      viewBox="0 0 32 32"
      width={size}
    >
      <Path d="M15.001,4.004v3.999	h2.001V4.004H15.001z" fill="#8c1539" />

      <Path
        d="M7.003,16.003v8h2v2h2v2	h4v2h2v-2h4v-2h2v-2h2v-8l-9-3L7.003,16.003z"
        fill="#f18f06"
      />

      <Path
        d="M7.003,16.003v-2h-2v-4	h2v-2h2v-2h14v2h2v2h2v4h-2v2H7.003z"
        fill="#cc273a"
      />

      <Path d="M17.003,2.004v1.999	h1.999V2.004H17.003z" fill="#8c1539" />
    </Svg>
  )
}
