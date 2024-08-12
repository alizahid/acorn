/** @type {import('prettier').Config} */
module.exports = {
  overrides: [
    {
      files: 'apps/web/src/**/*.tsx',
      options: {
        plugins: ['prettier-plugin-tailwindcss'],
        tailwindConfig: 'apps/web/tailwind.config.ts',
        tailwindFunctions: ['twMerge'],
      },
    },
  ],
  plugins: ['prettier-plugin-packagejson'],
  semi: false,
  singleQuote: true,
}
