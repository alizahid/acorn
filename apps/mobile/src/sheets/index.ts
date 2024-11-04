import { registerSheet } from 'react-native-actions-sheet'

import { PostMenuSheet, type PostMenuSheetDefinition } from './post-menu'

registerSheet('post-menu', PostMenuSheet)

declare module 'react-native-actions-sheet' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- go away
  interface Sheets {
    'post-menu': PostMenuSheetDefinition
  }
}
