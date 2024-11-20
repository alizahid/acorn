export const InboxTab = ['notifications', 'messages'] as const

export type InboxTab = (typeof InboxTab)[number]

export type InboxItem =
  | {
      data: InboxNotification
      type: 'notification'
    }
  | {
      data: InboxMessage
      type: 'message'
    }

export type NotificationType =
  | 'comment_reply'
  | 'post_reply'
  | 'username_mention'

export type InboxNotification = {
  author: string
  body: string
  context: string
  createdAt: Date
  id: string
  new: boolean
  subreddit: string
  type: NotificationType
}

export type InboxMessage = {
  author: string
  body: string
  createdAt: Date
  id: string
  new: boolean
  subject: string
}
