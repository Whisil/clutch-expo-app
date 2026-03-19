import js from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import importPlugin from 'eslint-plugin-import'
import prettierPlugin from 'eslint-plugin-prettier'
import globals from 'globals'

export default [
  js.configs.recommended,
  {
    ignores: [
      'node_modules/**',
      '.expo/**',
      'dist/**',
      'web-build/**',
      'coverage/**',
      'build/**',
      'ios/**',
      'android/**',
      '*.tsbuildinfo',
      'src/types/supabase.ts',
    ],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals['react-native'],
        process: 'readonly',
        require: 'readonly',
      },
    },
    plugins: {
      prettier: prettierPlugin,
      '@typescript-eslint': tseslint,
      import: importPlugin,
    },
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
    rules: {
      'prettier/prettier': ['error'],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          destructuredArrayIgnorePattern: '^_',
        },
      ],
      eqeqeq: 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      semi: ['error', 'never'],
      quotes: [
        'error',
        'single',
        {
          avoidEscape: true,
        },
      ],
      indent: ['off'],
      'block-spacing': ['error', 'always'],
      'linebreak-style': ['error', 'unix'],
      'no-multiple-empty-lines': [
        'error',
        {
          max: 1,
          maxEOF: 1,
        },
      ],
      'array-callback-return': 'error',
      'no-await-in-loop': 'error',
      'no-constant-binary-expression': 'error',
      'no-duplicate-imports': 'error',
      'no-new-native-nonconstructor': 'error',
      'no-self-compare': 'error',
      'no-template-curly-in-string': 'error',
      'no-unmodified-loop-condition': 'error',
      'no-unreachable-loop': 'error',
      'no-use-before-define': 'off',
      'require-atomic-updates': 'error',
      camelcase: 'off',
      'capitalized-comments': ['error', 'never'],
      'default-case': [
        'error',
        {
          commentPattern: '^skip\\sdefault',
        },
      ],
      'default-case-last': ['error'],
      'default-param-last': ['error'],
      'dot-notation': 'error',
      'func-style': [
        'error',
        'declaration',
        {
          allowArrowFunctions: true,
        },
      ],
      'max-depth': ['error', 5],
      'max-params': ['error', 4],
      'multiline-comment-style': ['error', 'separate-lines'],
      'no-continue': 'error',
      'no-confusing-arrow': 'error',
      'no-delete-var': 'error',
      'no-else-return': [
        'error',
        {
          allowElseIf: false,
        },
      ],
      'no-empty-function': 'error',
      'no-magic-numbers': 'off',
      '@typescript-eslint/no-magic-numbers': 'off',
      'no-shadow': 'error',
      'no-useless-catch': 'error',
      'no-useless-rename': 'error',
      'no-void': 'error',
      'object-shorthand': ['off', 'consistent'],
      'prefer-destructuring': 'error',
      radix: 'error',
      'spaced-comment': 'error',
      yoda: 'error',
      'array-bracket-spacing': ['error', 'never'],
      'dot-location': ['error', 'property'],
      'max-len': [
        'error',
        {
          code: 80,
          ignoreUrls: true,
          ignoreRegExpLiterals: true,
          ignorePattern: 'd="([\\s\\S]*?)"|import\\s.*@.*',
        },
      ],
      'space-in-parens': ['error', 'never'],
      'import/no-anonymous-default-export': ['off'],
      'import/order': [
        'error',
        {
          groups: [
            'external',
            'builtin',
            'internal',
            ['sibling', 'parent'],
            'index',
            'unknown',
          ],
          pathGroups: [
            {
              pattern: '@/components/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: '@/src/**',
              group: 'internal',
              position: 'after',
            },
          ],
          'newlines-between': 'never',
          alphabetize: {
            order: 'asc',
          },
        },
      ],
    },
  },
]
