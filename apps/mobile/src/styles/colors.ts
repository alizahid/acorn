type Scale = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

type Palette = Record<Scale, string>

export function createPalette(colors: Record<string, string>) {
  return Object.fromEntries(Object.values(colors)
    .map((color, index) => [index + 1, color])) as Palette
}
