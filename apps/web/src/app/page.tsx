import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

import { Icon } from '~/components/icon'
import { Logo } from '~/components/logo'

export default function Page() {
  const t = useTranslations('page.landing')

  const links = [
    {
      href: 'https://www.reddit.com/r/acornblue/',
      key: 'reddit',
    },
    {
      href: 'https://github.com/alizahid/acorn',
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

      <section className="flex">
        <Link
          className="rounded-[7px] outline-none focus-visible:ring focus-visible:ring-accent-9"
          href="https://testflight.apple.com/join/uKWP3MFB"
        >
          <Image
            alt={t('download.apple')}
            height={40 * 1.25}
            src="/images/app-store.svg"
            unoptimized
            width={120 * 1.25}
          />
        </Link>
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

      <footer className="flex gap-4">
        {links.map((link) => (
          <Link
            className="rounded-full p-2 text-accent-a11 outline-none transition-colors hover:text-accent-a12 focus-visible:bg-accent-4"
            href={link.href}
            key={link.key}
            title={t(`footer.${link.key}`)}
          >
            <Icon className="size-6" name={link.key} />
          </Link>
        ))}
      </footer>
    </main>
  )
}
