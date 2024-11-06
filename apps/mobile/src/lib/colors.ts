import { type ColorToken } from '~/styles/tokens'

const colors = [
  'accent',
  'blue',
  'crimson',
  'grass',
  'indigo',
  'ruby',
  'teal',
  'orange',
  'plum',
  'jade',
  'tomato',
] as const

export function getDepthColor(depth: number): ColorToken {
  return colors[depth] ?? 'gray'
}
