import { AccountsSheet } from '~/sheets/accounts'
import { CommentMenuSheet } from '~/sheets/comment-menu'
import { MenuSheet } from '~/sheets/menu'
import { PostMenuSheet } from '~/sheets/post-menu'
import { PostSortSheet } from '~/sheets/post-sort'

import { FeedTypeSheet } from '../../sheets/feed-type'

export function Sheets() {
  return (
    <>
      <FeedTypeSheet.Root />

      <PostSortSheet.Root />

      <PostMenuSheet.Root />
      <CommentMenuSheet.Root />

      <AccountsSheet.Root />

      <MenuSheet.Root />
    </>
  )
}
