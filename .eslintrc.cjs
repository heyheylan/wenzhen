/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  'vue/multi-word-component-names': [
    'warn',
    {
      ignores: ['index']
    }
  ],
  'vue/no-setup-props-destructure': ['off']
}
