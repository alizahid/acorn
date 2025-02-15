export const fonts = {
  apercu: 'Apercu Pro',
  basis: 'Basis Grotesque Pro',
  fold: 'Fold Grotesque Pro',
  mono: 'Basis Grotesque Mono Pro',
  system: 'San Francisco',
} as const

export type Font = Exclude<keyof typeof fonts, 'mono'>
