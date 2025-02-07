const { create } = require('eslint-config-custom')

module.exports = create({
  extends: ['plugin:@tanstack/eslint-plugin-query/recommended'],
  plugins: ['eslint-plugin-react-compiler'],
  root: true,
  rules: {
    'react-compiler/react-compiler': 'error',
  },
})
