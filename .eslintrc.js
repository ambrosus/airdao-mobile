module.exports = {
  env: {
    browser: false,
    es6: true
  },
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ['react-hooks', 'eslint-plugin-prettier'],
  rules: {
    'react/prop-types': 'off',
    'react/display-name': 'off',
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    'prettier/prettier': [
      'error',
      {
        semi: true
      }
    ],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'max-len': [0, 150, 2, { ignoreUrls: true }],
    'no-duplicate-imports': 'error',
    'camelcase': 'error',
    'prefer-arrow-callback': 'error',
    'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
    'no-multiple-empty-lines': ['error', { max: 1, maxBOF: 1 }]
  }
};
