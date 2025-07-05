import {
  Coffee,
  DiscordLogo,
  Fan,
  GithubLogo,
} from '@phosphor-icons/react/dist/ssr'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { Button } from '~/components/button'
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
    {
      href: 'https://github.com/alizahid/acorn',
      icon: <GithubLogo className="size-6" weight="fill" />,
      key: 'github',
    },
    {
      href: 'https://buymeacoffee.com/acornblue',
      icon: <Coffee className="size-6" weight="fill" />,
      key: 'coffee',
    },
  ] as const

  return (
    <main className="flex min-h-screen flex-col items-center gap-32 px-8 py-32">
      <header className="flex flex-col items-center gap-2">
        <Logo className="size-24" />

        <h1 className="font-bold text-6xl text-accent-a9">
          {t('header.title')}
        </h1>

        <p className="font-medium text-gray-a11">{t('header.description')}</p>
      </header>

      <section className="flex flex-col gap-6 lg:flex-row">
        {actions.map((action) => (
          <Button href={action.href} key={action.key}>
            {action.icon}

            {t(`action.${action.key}`)}
          </Button>
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
    </main>
  )
}
