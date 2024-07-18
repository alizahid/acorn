const { resolve } = require('node:path')

const project = resolve(process.cwd(), 'tsconfig.json')

/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: [
    'eslint:recommended',
    require.resolve('@vercel/style-guide/eslint/node'),
    require.resolve('@vercel/style-guide/eslint/browser'),
    require.resolve('@vercel/style-guide/eslint/typescript'),
    require.resolve('@vercel/style-guide/eslint/react'),
    'plugin:prettier/recommended',
  ],
  globals: {
    JSX: true,
    React: true,
  },
  ignorePatterns: ['node_modules/', 'dist/', 'build/'],
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.d.ts'],
      parserOptions: {
        project,
      },
      plugins: ['typescript-sort-keys'],
      rules: {
        '@typescript-eslint/array-type': [
          'error',
          {
            default: 'generic',
          },
        ],
        '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
        '@typescript-eslint/consistent-type-imports': [
          'warn',
          {
            fixStyle: 'inline-type-imports',
          },
        ],
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-misused-promises': [
          'error',
          {
            checksVoidReturn: {
              attributes: false,
            },
          },
        ],
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/restrict-template-expressions': [
          'error',
          {
            allowAny: false,
            allowBoolean: false,
            allowNever: false,
            allowNullish: false,
            allowNumber: true,
            allowRegExp: false,
          },
        ],
        'typescript-sort-keys/interface': 'error',
      },
      settings: {
        'import/resolver': {
          typescript: {
            project,
          },
        },
      },
    },
    {
      files: ['*.tsx'],
      rules: {
        'react/jsx-sort-props': 'error',
        'react/no-unstable-nested-components': 'off',
      },
    },
  ],
  plugins: ['sort-keys-fix', 'sort-destructure-keys', 'simple-import-sort'],
  rules: {
    'import/no-default-export': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        includeInternal: false,
      },
    ],
    'import/order': 'off',
    'no-nested-ternary': 'off',
    'prefer-named-capture-group': 'off',
    'prettier/prettier': 'error',
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': 'error',
    'sort-destructure-keys/sort-destructure-keys': 'error',
    'sort-keys-fix/sort-keys-fix': 'error',
  },
}
