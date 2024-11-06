import { registerSheet } from 'react-native-actions-sheet'

import {
  CommentMenuSheet,
  type CommentMenuSheetDefinition,
} from './comment-menu'
import { FeedTypeSheet, type FeedTypeSheetDefinition } from './feed-type'
import { PostMenuSheet, type PostMenuSheetDefinition } from './post-menu'
import { PostSortSheet, type PostSortSheetDefinition } from './post-sort'

registerSheet('post-menu', PostMenuSheet)
registerSheet('post-sort', PostSortSheet)
registerSheet('feed-type', FeedTypeSheet)
registerSheet('comment-menu', CommentMenuSheet)

declare module 'react-native-actions-sheet' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- go away
  interface Sheets {
    'comment-menu': CommentMenuSheetDefinition
    'feed-type': FeedTypeSheetDefinition
    'post-menu': PostMenuSheetDefinition
    'post-sort': PostSortSheetDefinition
  }
}
