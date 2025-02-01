/** @type {import('prettier').Config} */
module.exports = {
  overrides: [
    {
      files: 'apps/web/src/**/*.{tsx,css}',
      options: {
        plugins: ['prettier-plugin-tailwindcss'],
      },
    },
  ],
  plugins: ['prettier-plugin-packagejson'],
  semi: false,
  singleQuote: true,
}
