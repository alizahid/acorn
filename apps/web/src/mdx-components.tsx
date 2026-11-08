import Link from 'next/link'
import { type ComponentProps } from 'react'

const components = {
  a: ({ href = '', children }: ComponentProps<'a'>) => (
    <Link
      className="text-accent-11 hover:text-accent-12 focus-visible:outline-accent-a7 rounded-sm outline-offset-4 focus-visible:outline-2"
      href={href}
    >
      {children}
    </Link>
  ),
  h2: ({ children }: ComponentProps<'h2'>) => (
    <h2 className="text-accent-11 mt-12 text-3xl font-medium first:mt-0">
      {children}
    </h2>
  ),
  p: ({ children }: ComponentProps<'p'>) => (
    <p className="leading-relaxed">{children}</p>
  ),
}

export function useMDXComponents() {
  return components
}
