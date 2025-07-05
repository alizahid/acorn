import Link from 'next/link'
import { type ReactNode } from 'react'

type Props = {
  children: ReactNode
  href: string
}

export function Button({ children, href }: Props) {
  return (
    <Link
      className="flex items-center gap-2 rounded-lg bg-accent-a9 px-3 py-2 font-medium text-accent-contrast outline-none hover:bg-accent-a10 focus-visible:ring-2 focus-visible:ring-accent-a7"
      href={href}
    >
      {children}
    </Link>
  )
}
