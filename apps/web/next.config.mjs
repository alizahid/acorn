import createIntlPlugin from 'next-intl/plugin'

const withIntl = createIntlPlugin('./src/intl')

/** @type {import('next').NextConfig} */
const config = {}

export default withIntl(config)
