const { create } = require('eslint-config-custom')

module.exports = create({
  extends: ['plugin:@tanstack/eslint-plugin-query/recommended'],
  plugins: ['eslint-plugin-react-compiler'],
  root: true,
  rules: {
    'no-bitwise': 'off',
    'react-compiler/react-compiler': 'error',
  },
})
