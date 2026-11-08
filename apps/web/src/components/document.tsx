import { execFileSync } from 'node:child_process'
import { join } from 'node:path'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { type ReactNode } from 'react'

import { Logo } from '~/components/logo'

type Props = {
  children: ReactNode
  page: 'faq' | 'privacy' | 'terms'
}

export function Document({ children, page }: Props) {
  const t = useTranslations(`page.${page}`)

  const file = join(process.cwd(), 'src/app', page, 'content.mdx')

  const updated = lastCommit(file)

  return (
    <main className="flex min-h-screen flex-col items-center gap-16 px-8 py-32">
      <header className="flex flex-col items-center gap-8 text-center">
        <Link className="outline-none" href="/">
          <Logo className="size-24" />
        </Link>

        <h1 className="text-accent-a9 text-6xl font-bold">{t('header')}</h1>

        <p className="text-gray-11 text-sm">
          {t('updated', {
            date: updated ?? new Date(),
          })}
        </p>
      </header>

      <article className="flex w-full max-w-xl flex-col gap-4">
        {children}
      </article>
    </main>
  )
}

function lastCommit(file: string) {
  try {
    const date = execFileSync(
      'git',
      ['log', '-1', '--format=%aI', '--', file],
      {
        encoding: 'utf8',
      },
    ).trim()

    return date ? new Date(date) : null
  } catch {
    return null
  }
}
