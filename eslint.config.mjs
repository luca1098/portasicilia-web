import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'

const componentsConfig = defineConfig({
  files: ['components/**/*'],
  rules: {
    'no-restricted-imports': 'off',
  },
})

const eslintConfig = [
  ...nextVitals,
  ...nextTs,
  {
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
    },
    rules: {
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-debugger': ['error'],
      'import/no-unresolved': 'off',
      'import/default': 'off',
      'import/no-named-as-default-member': 'off',
      'react/no-children-prop': 'off',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@radix-ui/*'],
              message: 'You should use @radix-ui only for generate components, not directly in application',
            },
          ],
        },
      ],
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: false,
          optionalDependencies: false,
          peerDependencies: false,
        },
      ],
    },
  },
  ...componentsConfig,
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'public/**',
    'node_modules/**',
    'eslint.config.mjs',
    '*.config.js',
    '*.config.mjs',
  ]),
]
//override rules for components

//override rules for configuration files

export default defineConfig(eslintConfig)
