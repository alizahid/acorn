export type Message = {
  body: string
  createdAt: Date
  from: string
  id: string
  new: boolean
  replies?: Array<Message>
  to: string
  updatedAt: Date
}
