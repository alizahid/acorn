import createMdxPlugin from '@next/mdx'
import createIntlPlugin from 'next-intl/plugin'

const withIntl = createIntlPlugin('./src/intl/index.ts')
const withMdx = createMdxPlugin()

/** @type {import('next').NextConfig} */
const config = {}

export default withIntl(withMdx(config))
