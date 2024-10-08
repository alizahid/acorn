export type Community = {
  createdAt: Date
  id: string
  image?: string
  name: string
  subscribed: boolean
  subscribers: number
  user: boolean
}

export const CommunityTab = ['communities', 'users'] as const

export type CommunityTab = (typeof CommunityTab)[number]
