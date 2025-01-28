module.exports = {
  env: {
    browser: false,
    es6: true
  },
  parser: '@typescript-eslint/parser',
  ignorePatterns: ['node_modules/'],
  extends: [
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript'
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ['react-hooks', 'eslint-plugin-prettier', 'import'],
  rules: {
    'react/prop-types': 'off',
    'react/display-name': 'off',
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    'import/no-named-as-default': 'off',
    'import/no-named-as-default-member': 'off',
    'import/no-unresolved': 'error',
    'import/order': [
      'error',
      {
        groups: [
          'external', // External libraries like 'react', 'react-native'
          'builtin', // Built-in Node.js modules like 'fs'
          'internal', // Internal imports (e.g., aliases like '@components')
          ['sibling', 'parent'], // Relative imports
          'index', // Index imports like './'
          'object', // Imports of objects
          'type' // Type imports (TypeScript)
        ],
        pathGroups: [
          {
            pattern: 'react',
            group: 'external',
            position: 'before'
          },
          {
            pattern: 'react-native',
            group: 'external',
            position: 'before'
          }
        ],
        pathGroupsExcludedImportTypes: ['react', 'react-native'],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true
        }
      }
    ],
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
  },
  settings: {
    'react': {
      version: 'detect'
    },
    'import/core-modules': ['react', 'react-native'],
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true // TypeScript paths are respected
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }
    }
  }
};
