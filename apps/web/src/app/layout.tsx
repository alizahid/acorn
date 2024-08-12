import '~/styles/main.css'

import { type Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages, getTranslations } from 'next-intl/server'
import { type ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

import { mono, sans } from '~/assets/fonts'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('page.landing.meta')

  return {
    description: t('title'),
    title: t('title'),
  }
}

type Props = {
  children: ReactNode
}

export default async function RootLayout({ children }: Props) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html
      className={twMerge('dark', sans.variable, mono.variable)}
      lang={locale}
    >
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
