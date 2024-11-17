import { AccountsSheet } from '~/sheets/accounts'
import { MenuSheet } from '~/sheets/menu'

export function Sheets() {
  return (
    <>
      <AccountsSheet.Root />

      <MenuSheet.Root />
    </>
  )
}
