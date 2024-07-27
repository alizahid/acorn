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

export function getColorForIndex(index: number) {
  return colors[index % colors.length]
}
