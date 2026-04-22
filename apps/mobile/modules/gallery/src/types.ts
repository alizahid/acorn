import { type SFSymbol } from 'expo-symbols'

export type GalleryOpenProps = {
  images: Array<string>
  index?: number
  theme?: 'light' | 'dark'
  actions?: Array<{
    id: string
    icon: SFSymbol
  }>
}

export type GalleryOnActionEventPayload = {
  id: string
  url: string
}

export type GalleryEvents = {
  onAction: (payload: GalleryOnActionEventPayload) => void
}
