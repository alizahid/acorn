export type Community = {
  banner?: string
  createdAt: Date
  description?: string
  favorite: boolean
  id: string
  image?: string
  name: string
  subscribed: boolean
  subscribers: number
  title?: string
  user: boolean
}

export const CommunitiesTab = ['communities', 'users'] as const

export type CommunitiesTab = (typeof CommunitiesTab)[number]

export const CommunityTab = ['posts', 'about'] as const

export type CommunityTab = (typeof CommunityTab)[number]
