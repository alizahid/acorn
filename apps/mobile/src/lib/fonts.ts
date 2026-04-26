export const fonts = {
  apercu: 'Apercu Pro Var',
  basis: 'Basis Grotesque Pro Var',
  fold: 'Fold Grotesque Pro',
  mono: 'SF Mono',
  system: 'System',
} as const

export type Font = Exclude<keyof typeof fonts, 'mono'>
