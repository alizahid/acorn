import { ColorTokens } from '~/styles/colors'

export function getColorForIndex(index: number) {
  return ColorTokens[index % ColorTokens.length]
}
