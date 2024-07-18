import antfu from '@antfu/eslint-config'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import sortDestructureKeys from 'eslint-plugin-sort-destructure-keys'
import sortKeysFix from 'eslint-plugin-sort-keys-fix'
import typescriptSortKeys from 'eslint-plugin-typescript-sort-keys'

export default antfu({
  jsx: true,
  react: {
    overrides: {
      'style/jsx-sort-props': 'error',
    },
  },
  typescript: {
    ignoresTypeAware: ['babel.config.js', 'eslint.config.mjs'],
    overrides: {
      'ts/consistent-type-definitions': ['error', 'type'],
      'ts/consistent-type-imports': ['error', {
        fixStyle: 'inline-type-imports',
      }],
      'ts/no-use-before-define': ['error', {
        variables: false,
      }],
    },
    tsconfigPath: 'tsconfig.json',
  },
}, {
  plugins: {
    'simple-import-sort': simpleImportSort,
    'sort-destructure-keys': sortDestructureKeys,
    'sort-keys-fix': sortKeysFix,
    'typescript-sort-keys': typescriptSortKeys,
  },
  rules: {
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': 'error',
    'sort-destructure-keys/sort-destructure-keys': 'error',
    'sort-keys-fix/sort-keys-fix': 'error',
  },
})
