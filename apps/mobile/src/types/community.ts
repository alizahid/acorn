export type Community = {
  createdAt: Date
  id: string
  image?: string
  name: string
  subscribed: boolean
  subscribers: number
}

export const CommunitiesType = ['communities', 'users'] as const

export type CommunitiesType = (typeof CommunitiesType)[number]
