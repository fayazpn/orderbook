module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'airbnb',
    'airbnb/hooks',
    'airbnb-typescript',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'commitlint.config.cjs'],
  overrides: [
    {
      files: ['*.styles.ts'],
      rules: {
        'import/prefer-default-export': 'off',
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['react-refresh', '@typescript-eslint', 'prettier'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'prettier/prettier': [
      'error',
      {
        tabwidth: 2,
      },
    ],
    'react/react-in-jsx-scope': 0,
    'no-template-curly-in-string': 'error',
    'react/prop-types': 0,
    'no-nested-ternary': 'off',
    'react/require-default-props': 'warn',
    'react/jsx-props-no-spreading': 'off',
    '@typescript-eslint/comma-dangle': 'off',
  },
};
