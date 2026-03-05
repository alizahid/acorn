import {
  RenderHTMLConfigProvider,
  RenderHTMLSource,
  TRenderEngineProvider,
} from '@native-html/render'
import { withUnistyles } from 'react-native-unistyles'

export const RenderHtmlSource = withUnistyles(RenderHTMLSource)
export const RenderHtmlConfigProvider = withUnistyles(RenderHTMLConfigProvider)
export const RenderEngineProvider = withUnistyles(TRenderEngineProvider)
