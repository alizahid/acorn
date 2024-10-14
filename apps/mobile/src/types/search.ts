export const SearchTab = ['post', 'community', 'user'] as const

export type SearchTab = (typeof SearchTab)[number]
