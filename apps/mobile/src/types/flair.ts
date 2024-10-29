export type Flair =
  | {
      id: string
      type: 'text'
      value: string
    }
  | {
      id: string
      type: 'emoji'
      value: string
    }
