import Link from 'next/link'
import { type ReactNode } from 'react'

type Props = {
  children: ReactNode
  href: string
}

export function Button({ children, href }: Props) {
  return (
    <Link
      className="bg-accent-a9 text-accent-contrast hover:bg-accent-a10 focus-visible:ring-accent-a7 flex items-center gap-2 rounded-lg px-3 py-2 font-medium outline-none focus-visible:ring-2"
      href={href}
    >
      {children}
    </Link>
  )
}
