import { AccountsSheet } from '~/sheets/accounts'
import { CommentMenuSheet } from '~/sheets/comment-menu'
import { MenuSheet } from '~/sheets/menu'
import { PostMenuSheet } from '~/sheets/post-menu'
import { PostSortSheet } from '~/sheets/post-sort'

export function Sheets() {
  return (
    <>
      <PostSortSheet.Root />

      <PostMenuSheet.Root />
      <CommentMenuSheet.Root />

      <AccountsSheet.Root />

      <MenuSheet.Root />
    </>
  )
}
