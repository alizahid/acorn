import * as colors from '@radix-ui/colors'

export type ColorScale =
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | '11'
  | '12'
export type ColorScaleAlpha = `a${ColorScale}`
export type ColorScaleExtras = 'contrast' | 'surface'

export type BlackAndWhite = ColorScaleAlpha
export type Colors = ColorScale | ColorScaleAlpha | ColorScaleExtras

export function createPalette<Palette extends string>(
  ...names: Array<keyof typeof colors>
) {
  const palette: Array<[string, string]> = []

  for (const name of names) {
    const alpha = name.endsWith('A')
    const dark = name.endsWith('Dark') || name.endsWith('DarkA')

    palette.push(
      ...Object.values(colors[name]).map((color, index) => {
        const key = []

        if (alpha) {
          key.push('a')
        }

        key.push(index + 1)

        return [key.join(''), color] satisfies [string, string]
      }),
    )

    const extras = enhancePalette(name, dark)

    palette.push(...extras)
  }

  return Object.fromEntries(palette) as Record<Palette, string>
}

export const ColorTokens = [
  'accent',
  'amber',
  'blue',
  'bronze',
  'brown',
  'crimson',
  'cyan',
  'gold',
  'grass',
  'gray',
  'green',
  'indigo',
  'iris',
  'jade',
  'lime',
  'mauve',
  'mint',
  'olive',
  'orange',
  'pink',
  'plum',
  'purple',
  'red',
  'ruby',
  'sage',
  'sand',
  'sky',
  'slate',
  'teal',
  'tomato',
  'violet',
  'yellow',
] as const

export type ColorToken = (typeof ColorTokens)[number]

function enhancePalette(
  name: keyof typeof colors,
  dark?: boolean,
): Array<[string, string]> {
  if (name.startsWith('amber')) {
    return [
      ['contrast', '#21201c'],
      ['surface', dark ? '#271f1380' : '#fefae4cc'],
    ]
  }

  if (name.startsWith('blue')) {
    return [
      ['contrast', '#fff'],
      ['surface', dark ? '#11213d80' : '#f1f9ffcc'],
    ]
  }

  if (name.startsWith('bronze')) {
    return [
      ['contrast', '#fff'],
      ['surface', dark ? '#27211d80' : '#fdf5f3cc'],
    ]
  }

  if (name.startsWith('brown')) {
    return [
      ['contrast', '#fff'],
      ['surface', dark ? '#271f1b80' : '#fbf8f4cc'],
    ]
  }

  if (name.startsWith('crimson')) {
    return [
      ['contrast', '#fff'],
      ['surface', dark ? '#2f151f80' : '#fef5f8cc'],
    ]
  }

  if (name.startsWith('cyan')) {
    return [
      ['contrast', '#fff'],
      ['surface', dark ? '#11252d80' : '#eff9facc'],
    ]
  }

  if (name.startsWith('gold')) {
    return [
      ['contrast', '#fff'],
      ['surface', dark ? '#25231d80' : '#f9f8efcc'],
    ]
  }

  if (name.startsWith('grass')) {
    return [
      ['contrast', '#fff'],
      ['surface', dark ? '#19231b80' : '#f3faf3cc'],
    ]
  }

  if (name.startsWith('gray')) {
    return [
      ['contrast', '#fff'],
      ['surface', dark ? '#21212180' : '#ffffffcc'],
    ]
  }

  if (name.startsWith('green')) {
    return [
      ['contrast', '#fff'],
      ['surface', dark ? '#15251d80' : '#f1faf4cc'],
    ]
  }

  if (name.startsWith('indigo')) {
    return [
      ['contrast', '#fff'],
      ['surface', dark ? '#171d3b80' : '#f5f8ffcc'],
    ]
  }

  if (name.startsWith('iris')) {
    return [
      ['contrast', '#fff'],
      ['surface', dark ? '#1d1b3980' : '#f6f6ffcc'],
    ]
  }

  if (name.startsWith('jade')) {
    return [
      ['contrast', '#fff'],
      ['surface', dark ? '#13271f80' : '#f1faf5cc'],
    ]
  }

  if (name.startsWith('lime')) {
    return [
      ['contrast', '#1d211c'],
      ['surface', dark ? '#1b211580' : '#f6f9f0cc'],
    ]
  }

  if (name.startsWith('mauve')) {
    return [
      ['contrast', '#fff'],
      ['surface', dark ? '#22212380' : '#ffffffcc'],
    ]
  }

  if (name.startsWith('mint')) {
    return [
      ['contrast', '#1a211e'],
      ['surface', dark ? '#15272780' : '#effaf8cc'],
    ]
  }

  if (name.startsWith('olive')) {
    return [
      ['contrast', '#fff'],
      ['surface', dark ? '#1f201e80' : '#ffffffcc'],
    ]
  }

  if (name.startsWith('orange')) {
    return [
      ['contrast', '#fff'],
      ['surface', dark ? '#271d1380' : '#fff5e9cc'],
    ]
  }

  if (name.startsWith('pink')) {
    return [
      ['contrast', '#fff'],
      ['surface', dark ? '#31132980' : '#fef5facc'],
    ]
  }

  if (name.startsWith('plum')) {
    return [
      ['contrast', '#fff'],
      ['surface', dark ? '#2f152f80' : '#fdf5fdcc'],
    ]
  }

  if (name.startsWith('purple')) {
    return [
      ['contrast', '#fff'],
      ['surface', dark ? '#2b173580' : '#faf5fecc'],
    ]
  }

  if (name.startsWith('red')) {
    return [
      ['contrast', '#fff'],
      ['surface', dark ? '#2f151780' : '#fff5f5cc'],
    ]
  }

  if (name.startsWith('ruby')) {
    return [
      ['contrast', '#fff'],
      ['surface', dark ? '#2b191d80' : '#fff5f6cc'],
    ]
  }

  if (name.startsWith('sage')) {
    return [
      ['contrast', '#fff'],
      ['surface', dark ? '#1e201f80' : '#ffffffcc'],
    ]
  }

  if (name.startsWith('sand')) {
    return [
      ['contrast', '#fff'],
      ['surface', dark ? '#21212080' : '#ffffffcc'],
    ]
  }

  if (name.startsWith('sky')) {
    return [
      ['contrast', '#1c2024'],
      ['surface', dark ? '#13233b80' : '#eef9fdcc'],
    ]
  }

  if (name.startsWith('slate')) {
    return [
      ['contrast', '#fff'],
      ['surface', dark ? '#1f212380' : '#ffffffcc'],
    ]
  }

  if (name.startsWith('teal')) {
    return [
      ['contrast', '#fff'],
      ['surface', dark ? '#13272580' : '#f0faf8cc'],
    ]
  }

  if (name.startsWith('tomato')) {
    return [
      ['contrast', '#fff'],
      ['surface', dark ? '#2d191580' : '#fff6f5cc'],
    ]
  }

  if (name.startsWith('violet')) {
    return [
      ['contrast', '#fff'],
      ['surface', dark ? '#25193980' : '#f9f6ffcc'],
    ]
  }

  if (name.startsWith('yellow')) {
    return [
      ['contrast', '#21201c'],
      ['surface', dark ? '#231f1380' : '#fefbe4cc'],
    ]
  }

  return []
}
