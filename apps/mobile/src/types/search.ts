export const SearchType = ['post', 'community'] as const

export type SearchType = (typeof SearchType)[number]
