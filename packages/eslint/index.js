const { resolve } = require('node:path')

/**
 * @param {{
 *   root?: boolean
 *   next?: boolean
 *   plugins?: string[]
 *   rules?: Partial<import('eslint').Linter.RulesRecord>
 *   ignorePatterns?: string | string[]
 *   overrides?: import('eslint').Linter.ConfigOverride[]
 * }}
 *
 * @returns {import('eslint').Linter.Config}
 */
exports.create = ({
  ignorePatterns = [],
  next = false,
  overrides = [],
  plugins = [],
  root = false,
  rules = {},
}) => {
  const project = resolve(process.cwd(), 'tsconfig.json')

  /** @type {import('eslint').Linter.Config} */
  const config = {
    extends: [
      'eslint:recommended',
      require.resolve('@vercel/style-guide/eslint/node'),
      require.resolve('@vercel/style-guide/eslint/browser'),
      require.resolve('@vercel/style-guide/eslint/typescript'),
      require.resolve('@vercel/style-guide/eslint/react'),
      next && require.resolve('@vercel/style-guide/eslint/next'),
      'turbo',
      'plugin:prettier/recommended',
    ].filter(Boolean),
    globals: {
      JSX: true,
      React: true,
    },
    ignorePatterns: [...ignorePatterns, 'node_modules/', 'dist/', 'build/'],
    overrides: [
      ...overrides,
      {
        files: ['*.ts', '*.tsx', '*.d.ts'],
        parserOptions: {
          project,
        },
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
          'jsx-a11y/label-has-associated-control': 'off',
          'react/jsx-sort-props': 'error',
          'react/no-unstable-nested-components': 'off',
        },
      },
    ],
    plugins: [
      ...plugins,
      'sort-keys-fix',
      'sort-destructure-keys',
      'simple-import-sort',
      'typescript-sort-keys',
    ],
    root,
    rules: {
      ...rules,
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

  return config
}
