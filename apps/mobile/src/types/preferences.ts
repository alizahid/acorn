export const sides = ['left', 'right', null] as const

export type Side = (typeof sides)[number]
