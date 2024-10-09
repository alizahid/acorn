export type NotificationType = 'comment_reply' | 'post_reply'

export type Notification = {
  author: string
  context: string
  createdAt: Date
  id: string
  new: boolean
  subreddit: string
  type: NotificationType
}
