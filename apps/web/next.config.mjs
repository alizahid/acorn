// eslint-disable-next-line import/no-unresolved -- go away
import createIntlPlugin from 'next-intl/plugin'

const withIntl = createIntlPlugin('./src/intl')

/** @type {import('next').NextConfig} */
const config = {}

export default withIntl(config)
