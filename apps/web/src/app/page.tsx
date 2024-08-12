import { GithubLogo, RedditLogo } from '@phosphor-icons/react/dist/ssr'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

import { Logo } from '~/components/logo'

export default function Page() {
  const t = useTranslations('page.landing')

  const links = [
    {
      href: 'https://www.reddit.com/r/acornblue/',
      icon: <RedditLogo className="size-6" weight="light" />,
      key: 'reddit',
    },
    {
      href: 'https://github.com/alizahid/acorn',
      icon: <GithubLogo className="size-6" weight="light" />,
      key: 'github',
    },
  ] as const

  return (
    <main className="flex min-h-screen flex-col items-center gap-32 px-8 py-32">
      <header className="flex flex-col items-center gap-2">
        <Logo className="size-24" />

        <h1 className="text-6xl font-bold text-accent-a9">
          {t('header.title')}
        </h1>

        <p className="font-medium text-gray-11">{t('header.description')}</p>
      </header>

      <section className="flex flex-col gap-6 lg:flex-row">
        <Image
          alt={t('screenshot.dark')}
          height={1920 / 2}
          src="/images/screenshot-dark.png"
          width={939 / 2}
        />

        <Image
          alt={t('screenshot.light')}
          height={1920 / 2}
          src="/images/screenshot-light.png"
          width={939 / 2}
        />
      </section>

      <footer className="flex gap-4">
        {links.map((link) => (
          <Link
            className="text-accent-a11 transition-colors hover:text-accent-a12"
            href={link.href}
            key={link.key}
            title={t(`footer.${link.key}`)}
          >
            {link.icon}
          </Link>
        ))}
      </footer>
    </main>
  )
}
