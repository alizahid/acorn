import {
  RenderHTMLConfigProvider,
  RenderHTMLSource,
  TRenderEngineProvider,
} from 'react-native-render-html'
import { withUnistyles } from 'react-native-unistyles'

export const RenderHtmlSource = withUnistyles(RenderHTMLSource)
export const RenderHtmlConfigProvider = withUnistyles(RenderHTMLConfigProvider)
export const RenderEngineProvider = withUnistyles(TRenderEngineProvider)
