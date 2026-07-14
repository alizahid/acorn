import { NativeModule, requireNativeModule } from 'expo'

import { type CornerInsets, type HelpersEvents } from './types'

declare class HelpersModule extends NativeModule<HelpersEvents> {
  getCornerInsets(): CornerInsets
}

export const Helpers = requireNativeModule<HelpersModule>('Helpers')
