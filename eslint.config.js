import { defineConfig, globalIgnores } from 'eslint/config'
import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import jest from 'eslint-plugin-jest'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import storybook from 'eslint-plugin-storybook'
import eslintConfigPrettier from 'eslint-config-prettier'

const sourceFiles = ['**/*.{js,mjs,cjs,jsx,ts,tsx}']
const testFiles = ['**/*.{test,spec}.{js,jsx,ts,tsx}']

export default defineConfig([
  globalIgnores([
    '.eslintcache',
    '.yarn/**',
    'build',
    'build/**',
    'coverage',
    'coverage/**',
    'dist',
    'dist/**',
    'node_modules/**',
    'public/**',
    'storybook-static',
    'storybook-static/**',
  ]),
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
  },
  {
    files: sourceFiles,
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  reactHooks.configs.flat.recommended,
  reactRefresh.configs.vite,
  {
    ...jest.configs['flat/recommended'],
    files: testFiles,
    languageOptions: {
      ...jest.configs['flat/recommended'].languageOptions,
      globals: {
        ...globals.jest,
        ...globals.node,
      },
    },
    rules: {
      ...jest.configs['flat/recommended'].rules,
      '@typescript-eslint/no-require-imports': 'off',
      'jest/no-disabled-tests': 'off',
    },
  },
  {
    files: ['**/*.cjs'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  ...storybook.configs['flat/recommended'],
  eslintConfigPrettier,
  {
    files: sourceFiles,
    rules: {
      'no-debugger': 'error',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'react-hooks/refs': 'off',
      'react-hooks/static-components': 'off',
      'react-refresh/only-export-components': 'off',
      'react/prop-types': 'off',
    },
  },
])
