export type Message = {
  author: string
  body: string
  createdAt: Date
  id: string
  new: boolean
  replies?: Array<Message>
  subject: string
}
