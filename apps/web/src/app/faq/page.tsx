import { type Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { Document } from '~/components/document'

import Content from './content.mdx'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('page.faq')

  return {
    title: t('title'),
  }
}

export default function Page() {
  return (
    <Document page="faq">
      <Content />
    </Document>
  )
}
