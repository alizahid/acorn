import Link from 'next/link'
import { useMessages, useTranslations } from 'next-intl'
import { type ReactNode } from 'react'

import { Logo } from '~/components/logo'

const links = {
  apple: 'https://www.apple.com/legal/privacy/',
  appleEula:
    'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/',
  discord: 'https://discord.gg/sWzw5GU5RV',
  expo: 'https://expo.dev/privacy',
  github: 'https://github.com/alizahid/acorn',
  license: 'https://github.com/alizahid/acorn/blob/main/license',
  privacy: '/privacy',
  reddit: 'https://www.reddit.com/policies/privacy-policy',
  redditApi: 'https://redditinc.com/policies/data-api-terms',
  redditTerms: 'https://redditinc.com/policies/user-agreement',
  sentry: 'https://sentry.io/privacy/',
} as const

const tags = Object.fromEntries(
  Object.entries(links).map(([key, href]) => [
    key,
    (text: ReactNode) => (
      <Link className="text-accent-11 outline-none" href={href}>
        {text}
      </Link>
    ),
  ]),
)

type Props = {
  page: 'privacy' | 'terms'
}

export function Document({ page }: Props) {
  const t = useTranslations(`page.${page}`)

  const { sections } = useMessages().page[page]

  const rich = t.rich as unknown as (
    key: string,
    values: typeof tags,
  ) => ReactNode

  return (
    <main className="flex min-h-screen flex-col items-center gap-16 px-8 py-32">
      <header className="flex flex-col items-center gap-8 text-center">
        <Link className="outline-none" href="/">
          <Logo className="size-24" />
        </Link>

        <h1 className="font-bold text-6xl text-accent-a9">{t('title')}</h1>

        <p className="text-gray-11 text-sm">{t('updated')}</p>
      </header>

      {sections.map((section, index) => (
        <section
          className="flex w-full max-w-xl flex-col gap-4"
          key={section.title}
        >
          <h2 className="font-medium text-3xl text-accent-12">
            {section.title}
          </h2>

          {section.body.map((paragraph, item) => (
            <p className="leading-relaxed" key={paragraph}>
              {rich(`sections.${index}.body.${item}`, tags)}
            </p>
          ))}
        </section>
      ))}
    </main>
  )
}
