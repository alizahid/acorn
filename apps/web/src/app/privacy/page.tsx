import { type Metadata } from 'next'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'

import { Logo } from '~/components/logo'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('page.privacy')

  return {
    title: t('title'),
  }
}

export default function Page() {
  const t = useTranslations('page.privacy')

  return (
    <main className="flex min-h-screen flex-col items-center gap-32 px-8 py-32 text-center">
      <header className="flex flex-col items-center gap-8">
        <Link className="outline-none" href="/">
          <Logo className="size-24" />
        </Link>

        <h1 className="font-bold text-6xl text-accent-a9">{t('title')}</h1>
      </header>

      {(
        [
          {
            items: ['website.1'],
            key: 'website',
          },
          {
            items: ['app.1', 'app.2', 'app.3', 'app.4'],
            key: 'app',
          },
        ] as const
      ).map((section) => (
        <section className="flex max-w-lg flex-col gap-4" key={section.key}>
          <h2 className="font-medium text-4xl text-accent-12">
            {t(`${section.key}.title`)}
          </h2>

          {section.items.map((item) => (
            <p key={item}>
              {t.rich(item, {
                revenueCatLink: (text) => (
                  <Link
                    className="text-accent-11 outline-none"
                    href="https://www.revenuecat.com/privacy"
                  >
                    {text}
                  </Link>
                ),
                sentryLink: (text) => (
                  <Link
                    className="text-accent-11 outline-none"
                    href="https://sentry.io/privacy/"
                  >
                    {text}
                  </Link>
                ),
              })}
            </p>
          ))}
        </section>
      ))}
    </main>
  )
}
