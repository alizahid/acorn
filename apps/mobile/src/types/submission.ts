import { type Flair } from './flair'

export type Submission = {
  community: {
    id: string
    image?: string
    name: string
  }
  flair: Array<
    | {
        background?: string
        color: 'light' | 'dark'
        flair: Array<Flair>
        id: string
        type: 'richtext'
      }
    | {
        background?: string
        color: 'light' | 'dark'
        id: string
        text: string
        type: 'text'
      }
  >
  media: {
    gallery: boolean
    image: boolean
    link: boolean
    spoiler: boolean
    text: boolean
    video: boolean
  }
}
