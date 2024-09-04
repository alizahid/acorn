export const SearchTab = ['post', 'community'] as const

export type SearchTab = (typeof SearchTab)[number]
