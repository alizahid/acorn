export const InboxTab = ['notifications', 'messages'] as const

export type InboxTab = (typeof InboxTab)[number]

export type InboxMessage = {
  author: string
  body: string
  createdAt: Date
  id: string
  new: boolean
  subject: string
}
