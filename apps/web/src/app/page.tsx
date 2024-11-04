import {
  DiscordLogo,
  Fan,
  GithubLogo,
  RedditLogo,
} from '@phosphor-icons/react/dist/ssr'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

import { Logo } from '~/components/logo'

export default function Page() {
  const t = useTranslations('page.landing')

  const actions = [
    {
      href: 'https://testflight.apple.com/join/uKWP3MFB',
      icon: <Fan className="size-6" weight="fill" />,
      key: 'testFlight',
    },
    {
      href: 'https://discord.gg/sWzw5GU5RV',
      icon: <DiscordLogo className="size-6" weight="fill" />,
      key: 'discord',
    },
  ] as const

  const links = [
    {
      href: 'https://www.reddit.com/r/acornblue/',
      icon: <RedditLogo className="size-6" />,
      key: 'reddit',
    },
    {
      href: 'https://discord.gg/sWzw5GU5RV',
      icon: <DiscordLogo className="size-6" />,
      key: 'discord',
    },
    {
      href: 'https://github.com/alizahid/acorn',
      icon: <GithubLogo className="size-6" />,
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

        <p className="font-medium text-gray-a11">{t('header.description')}</p>
      </header>

      <section className="flex gap-6">
        {actions.map((action) => (
          <Link
            className="flex items-center gap-2 rounded-lg bg-accent-a9 px-3 py-2 font-medium text-accent-contrast outline-none hover:bg-accent-a10 focus-visible:ring focus-visible:ring-accent-a7"
            href="https://testflight.apple.com/join/uKWP3MFB"
            key={action.key}
          >
            {action.icon}

            {t(`action.${action.key}`)}
          </Link>
        ))}
      </section>

      <section className="flex flex-col gap-6 lg:flex-row">
        <Image
          alt={t('screenshot.dark')}
          height={1972 / 2}
          src="/images/screenshot-dark.png"
          width={960 / 2}
        />

        <Image
          alt={t('screenshot.light')}
          height={1972 / 2}
          src="/images/screenshot-light.png"
          width={960 / 2}
        />
      </section>

      <footer className="flex flex-col items-center gap-4 lg:flex-row">
        {links.map((link) => (
          <Link
            className="flex items-center gap-3 rounded-full px-4 py-2 text-accent-a11 outline-none transition-colors hover:text-accent-a12 focus-visible:bg-accent-a4"
            href={link.href}
            key={link.key}
          >
            {link.icon}

            {t(`footer.${link.key}`)}
          </Link>
        ))}
      </footer>
    </main>
  )
}
