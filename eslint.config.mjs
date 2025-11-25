import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-debugger': ['error'],
      'import/no-unresolved': 'off',
      'import/default': 'off',
      'import/no-named-as-default-member': 'off',
      'react/no-children-prop': 'off',
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
    overrides: [
      {
        files: ['components/**/*'],
        rules: { 'no-restricted-imports': 'off' },
      },
      {
        files: ['eslint.config.mjs'],
        rules: { 'import/no-extraneous-dependencies': 'off' },
      },
    ],
  },
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
])

export default defineConfig(eslintConfig)
