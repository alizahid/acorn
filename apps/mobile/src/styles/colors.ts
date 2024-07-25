type ColorScale = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
type Extras = 'contrast' | 'surface'

export function createPalette(colors: Record<string, string>) {
  return Object.fromEntries(
    Object.values(colors).map((color, index) => [index + 1, color]),
  ) as Record<ColorScale, string>
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

export function createPaletteWithExtras(
  colors: Record<string, string>,
  name?: ColorToken,
  dark?: boolean,
) {
  const palette = createPalette(colors)

  if (name === 'amber') {
    return {
      ...palette,
      contrast: '#21201c',
      surface: dark ? '#271f1380' : '#fefae4cc',
    } as Record<ColorScale | Extras, string>
  }

  if (name === 'blue') {
    return {
      ...palette,
      contrast: '#fff',
      surface: dark ? '#11213d80' : '#f1f9ffcc',
    } as Record<ColorScale | Extras, string>
  }

  if (name === 'bronze') {
    return {
      ...palette,
      contrast: '#fff',
      surface: dark ? '#27211d80' : '#fdf5f3cc',
    } as Record<ColorScale | Extras, string>
  }

  if (name === 'brown') {
    return {
      ...palette,
      contrast: '#fff',
      surface: dark ? '#271f1b80' : '#fbf8f4cc',
    } as Record<ColorScale | Extras, string>
  }

  if (name === 'crimson') {
    return {
      ...palette,
      contrast: '#fff',
      surface: dark ? '#2f151f80' : '#fef5f8cc',
    } as Record<ColorScale | Extras, string>
  }

  if (name === 'cyan') {
    return {
      ...palette,
      contrast: '#fff',
      surface: dark ? '#11252d80' : '#eff9facc',
    } as Record<ColorScale | Extras, string>
  }

  if (name === 'gold') {
    return {
      ...palette,
      contrast: '#fff',
      surface: dark ? '#25231d80' : '#f9f8efcc',
    } as Record<ColorScale | Extras, string>
  }

  if (name === 'grass') {
    return {
      ...palette,
      contrast: '#fff',
      surface: dark ? '#19231b80' : '#f3faf3cc',
    } as Record<ColorScale | Extras, string>
  }

  if (name === 'gray') {
    return {
      ...palette,
      contrast: '#fff',
      surface: dark ? '#21212180' : '#ffffffcc',
    } as Record<ColorScale | Extras, string>
  }

  if (name === 'green') {
    return {
      ...palette,
      contrast: '#fff',
      surface: dark ? '#15251d80' : '#f1faf4cc',
    } as Record<ColorScale | Extras, string>
  }

  if (name === 'indigo') {
    return {
      ...palette,
      contrast: '#fff',
      surface: dark ? '#171d3b80' : '#f5f8ffcc',
    } as Record<ColorScale | Extras, string>
  }

  if (name === 'iris') {
    return {
      ...palette,
      contrast: '#fff',
      surface: dark ? '#1d1b3980' : '#f6f6ffcc',
    } as Record<ColorScale | Extras, string>
  }

  if (name === 'jade') {
    return {
      ...palette,
      contrast: '#fff',
      surface: dark ? '#13271f80' : '#f1faf5cc',
    } as Record<ColorScale | Extras, string>
  }

  if (name === 'lime') {
    return {
      ...palette,
      contrast: '#1d211c',
      surface: dark ? '#1b211580' : '#f6f9f0cc',
    } as Record<ColorScale | Extras, string>
  }

  if (name === 'mauve') {
    return {
      ...palette,
      contrast: '#fff',
      surface: dark ? '#22212380' : '#ffffffcc',
    } as Record<ColorScale | Extras, string>
  }

  if (name === 'mint') {
    return {
      ...palette,
      contrast: '#1a211e',
      surface: dark ? '#15272780' : '#effaf8cc',
    } as Record<ColorScale | Extras, string>
  }

  if (name === 'olive') {
    return {
      ...palette,
      contrast: '#fff',
      surface: dark ? '#1f201e80' : '#ffffffcc',
    } as Record<ColorScale | Extras, string>
  }

  if (name === 'orange') {
    return {
      ...palette,
      contrast: '#fff',
      surface: dark ? '#271d1380' : '#fff5e9cc',
    } as Record<ColorScale | Extras, string>
  }

  if (name === 'pink') {
    return {
      ...palette,
      contrast: '#fff',
      surface: dark ? '#31132980' : '#fef5facc',
    } as Record<ColorScale | Extras, string>
  }

  if (name === 'plum') {
    return {
      ...palette,
      contrast: '#fff',
      surface: dark ? '#2f152f80' : '#fdf5fdcc',
    } as Record<ColorScale | Extras, string>
  }

  if (name === 'purple') {
    return {
      ...palette,
      contrast: '#fff',
      surface: dark ? '#2b173580' : '#faf5fecc',
    } as Record<ColorScale | Extras, string>
  }

  if (name === 'red') {
    return {
      ...palette,
      contrast: '#fff',
      surface: dark ? '#2f151780' : '#fff5f5cc',
    } as Record<ColorScale | Extras, string>
  }

  if (name === 'ruby') {
    return {
      ...palette,
      contrast: '#fff',
      surface: dark ? '#2b191d80' : '#fff5f6cc',
    } as Record<ColorScale | Extras, string>
  }

  if (name === 'sage') {
    return {
      ...palette,
      contrast: '#fff',
      surface: dark ? '#1e201f80' : '#ffffffcc',
    } as Record<ColorScale | Extras, string>
  }

  if (name === 'sand') {
    return {
      ...palette,
      contrast: '#fff',
      surface: dark ? '#21212080' : '#ffffffcc',
    } as Record<ColorScale | Extras, string>
  }

  if (name === 'sky') {
    return {
      ...palette,
      contrast: '#1c2024',
      surface: dark ? '#13233b80' : '#eef9fdcc',
    } as Record<ColorScale | Extras, string>
  }

  if (name === 'slate') {
    return {
      ...palette,
      contrast: '#fff',
      surface: dark ? '#1f212380' : '#ffffffcc',
    } as Record<ColorScale | Extras, string>
  }

  if (name === 'teal') {
    return {
      ...palette,
      contrast: '#fff',
      surface: dark ? '#13272580' : '#f0faf8cc',
    } as Record<ColorScale | Extras, string>
  }

  if (name === 'tomato') {
    return {
      ...palette,
      contrast: '#fff',
      surface: dark ? '#2d191580' : '#fff6f5cc',
    } as Record<ColorScale | Extras, string>
  }

  if (name === 'violet') {
    return {
      ...palette,
      contrast: '#fff',
      surface: dark ? '#25193980' : '#f9f6ffcc',
    } as Record<ColorScale | Extras, string>
  }

  if (name === 'yellow') {
    return {
      ...palette,
      contrast: '#21201c',
      surface: dark ? '#231f1380' : '#fefbe4cc',
    } as Record<ColorScale | Extras, string>
  }

  return palette as Record<ColorScale | Extras, string>
}
