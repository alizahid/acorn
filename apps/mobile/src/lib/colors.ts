/* eslint-disable no-bitwise -- we doing cool things */

const colors = [
  'amber',
  'blue',
  'bronze',
  'brown',
  'crimson',
  'cyan',
  'gold',
  'grass',
  'green',
  'indigo',
  'iris',
  'jade',
  'lime',
  'mint',
  'orange',
  'pink',
  'plum',
  'purple',
  'red',
  'ruby',
  'sky',
  'teal',
  'tomato',
  'violet',
  'yellow',
] as const

export type ColorId = (typeof colors)[number]

export function getColorForId(id: string): ColorId {
  return colors[getIndex(id)]
}

function getIndex(id: string): number {
  let hash = 5381

  for (let i = 0; i < id.length; i++) {
    hash = (hash * 33) ^ id.charCodeAt(i)
  }
  const hashed = hash >>> 0

  return hashed % colors.length
}
