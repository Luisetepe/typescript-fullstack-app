import { fixupConfigRules, fixupPluginRules } from '@eslint/compat'
import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import jsxA11Y from 'eslint-plugin-jsx-a11y'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import unicorn from 'eslint-plugin-unicorn'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

/**
 * @see https://eslint.org/docs/latest/use/configure/configuration-files
 * @type {import('eslint').Linter.FlatConfig[]}
 */
export default [
  {
    ignores: ['**/node_modules/', '**/dist/', '**/build/'],
  },
  ...fixupConfigRules(
    compat.extends(
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:@typescript-eslint/recommended',
      'prettier',
      'plugin:jsx-a11y/recommended'
    )
  ),
  {
    plugins: {
      unicorn,
      react: fixupPluginRules(react),
      'react-hooks': fixupPluginRules(reactHooks),
      '@typescript-eslint': fixupPluginRules(typescriptEslint),
      'jsx-a11y': fixupPluginRules(jsxA11Y),
      'react-refresh': reactRefresh,
    },

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',

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

    rules: {
      'react-refresh/only-export-components': [
        'warn',
        {
          allowConstantExport: true,
        },
      ],

      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',

      'prefer-const': 'error',
      'react-hooks/exhaustive-deps': 'error',

      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
]
