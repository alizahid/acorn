import * as colors from '@radix-ui/colors'

import { type ColorToken } from './tokens'

type RadixColor = keyof typeof colors

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
export type ColorScaleExtras = 'contrast'

export type BlackAndWhite = ColorScaleAlpha
export type Colors = ColorScale | ColorScaleAlpha | ColorScaleExtras

type PaletteColor = Exclude<ColorToken, 'accent'>

export function createLightPalette(color: PaletteColor) {
  const gray = getGray(color)

  return {
    accent: createPalette<Colors>(color, `${color}A`),
    amber: createPalette<Colors>('amber', 'amberA'),
    black: createPalette<BlackAndWhite>('blackA'),
    blue: createPalette<Colors>('blue', 'blueA'),
    bronze: createPalette<Colors>('bronze', 'bronzeA'),
    brown: createPalette<Colors>('brown', 'brownA'),
    crimson: createPalette<Colors>('crimson', 'crimsonA'),
    cyan: createPalette<Colors>('cyan', 'cyanA'),
    gold: createPalette<Colors>('gold', 'goldA'),
    grass: createPalette<Colors>('grass', 'grassA'),
    gray: createPalette<Colors>(gray, `${gray}A`),
    green: createPalette<Colors>('green', 'greenA'),
    indigo: createPalette<Colors>('indigo', 'indigoA'),
    iris: createPalette<Colors>('iris', 'irisA'),
    jade: createPalette<Colors>('jade', 'jadeA'),
    lime: createPalette<Colors>('lime', 'limeA'),
    mauve: createPalette<Colors>('mauve', 'mauveA'),
    mint: createPalette<Colors>('mint', 'mintA'),
    olive: createPalette<Colors>('olive', 'oliveA'),
    orange: createPalette<Colors>('orange', 'orangeA'),
    pink: createPalette<Colors>('pink', 'pinkA'),
    plum: createPalette<Colors>('plum', 'plumA'),
    purple: createPalette<Colors>('purple', 'purpleA'),
    red: createPalette<Colors>('red', 'redA'),
    ruby: createPalette<Colors>('ruby', 'rubyA'),
    sage: createPalette<Colors>('sage', 'sageA'),
    sand: createPalette<Colors>('sand', 'sandA'),
    sky: createPalette<Colors>('sky', 'skyA'),
    slate: createPalette<Colors>('slate', 'slateA'),
    teal: createPalette<Colors>('teal', 'tealA'),
    tomato: createPalette<Colors>('tomato', 'tomatoA'),
    violet: createPalette<Colors>('violet', 'violetA'),
    white: createPalette<BlackAndWhite>('whiteA'),
    yellow: createPalette<Colors>('yellow', 'yellowA'),
  }
}

export function createDarkPalette(color: PaletteColor) {
  const gray = getGray(color)

  return {
    accent: createPalette<Colors>(`${color}Dark`, `${color}DarkA`),
    amber: createPalette<Colors>('amberDark', 'amberDarkA'),
    black: createPalette<BlackAndWhite>('blackA'),
    blue: createPalette<Colors>('blueDark', 'blueDarkA'),
    bronze: createPalette<Colors>('bronzeDark', 'bronzeDarkA'),
    brown: createPalette<Colors>('brownDark', 'brownDarkA'),
    crimson: createPalette<Colors>('crimsonDark', 'crimsonDarkA'),
    cyan: createPalette<Colors>('cyanDark', 'cyanDarkA'),
    gold: createPalette<Colors>('goldDark', 'goldDarkA'),
    grass: createPalette<Colors>('grassDark', 'grassDarkA'),
    gray: createPalette<Colors>(`${gray}Dark`, `${gray}DarkA`),
    green: createPalette<Colors>('greenDark', 'greenDarkA'),
    indigo: createPalette<Colors>('indigoDark', 'indigoDarkA'),
    iris: createPalette<Colors>('irisDark', 'irisDarkA'),
    jade: createPalette<Colors>('jadeDark', 'jadeDarkA'),
    lime: createPalette<Colors>('limeDark', 'limeDarkA'),
    mauve: createPalette<Colors>('mauveDark', 'mauveDarkA'),
    mint: createPalette<Colors>('mintDark', 'mintDarkA'),
    olive: createPalette<Colors>('oliveDark', 'oliveDarkA'),
    orange: createPalette<Colors>('orangeDark', 'orangeDarkA'),
    pink: createPalette<Colors>('pinkDark', 'pinkDarkA'),
    plum: createPalette<Colors>('plumDark', 'plumDarkA'),
    purple: createPalette<Colors>('purpleDark', 'purpleDarkA'),
    red: createPalette<Colors>('redDark', 'redDarkA'),
    ruby: createPalette<Colors>('rubyDark', 'rubyDarkA'),
    sage: createPalette<Colors>('sageDark', 'sageDarkA'),
    sand: createPalette<Colors>('sandDark', 'sandDarkA'),
    sky: createPalette<Colors>('skyDark', 'skyDarkA'),
    slate: createPalette<Colors>('slateDark', 'slateDarkA'),
    teal: createPalette<Colors>('tealDark', 'tealDarkA'),
    tomato: createPalette<Colors>('tomatoDark', 'tomatoDarkA'),
    violet: createPalette<Colors>('violetDark', 'violetDarkA'),
    white: createPalette<BlackAndWhite>('whiteA'),
    yellow: createPalette<Colors>('yellowDark', 'yellowDarkA'),
  }
}

function getGray(color: PaletteColor) {
  if (
    [
      'tomato',
      'red',
      'ruby',
      'crimson',
      'pink',
      'plum',
      'purple',
      'violet',
    ].includes(color)
  ) {
    return 'mauve'
  }

  if (['iris', 'indigo', 'blue', 'sky', 'cyan'].includes(color)) {
    return 'slate'
  }

  if (['mint', 'teal', 'jade', 'green'].includes(color)) {
    return 'sage'
  }

  if (['grass', 'lime'].includes(color)) {
    return 'olive'
  }

  if (['yellow', 'amber', 'orange', 'brown'].includes(color)) {
    return 'sand'
  }

  return 'gray'
}

export function createPalette<Palette extends string>(
  ...names: Array<RadixColor>
) {
  const palette: Array<[string, string]> = []

  for (const name of names) {
    const alpha = name.endsWith('A')

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

    palette.push([
      'contrast',
      name.startsWith('sky') ||
      name.startsWith('mint') ||
      name.startsWith('lime') ||
      name.startsWith('yellow') ||
      name.startsWith('amber')
        ? '#000'
        : '#fff',
    ])
  }

  return Object.fromEntries(palette) as Record<Palette, string>
}
