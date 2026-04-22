import { NativeModule, requireNativeModule } from 'expo'

import { type GalleryEvents, type GalleryOpenProps } from './types'

declare class GalleryModule extends NativeModule<GalleryEvents> {
  open(payload: GalleryOpenProps): void
}

export const Gallery = requireNativeModule<GalleryModule>('Gallery')
