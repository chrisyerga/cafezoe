import js from '@eslint/js'
import convexPlugin from '@convex-dev/eslint-plugin'
import prettier from 'eslint-config-prettier'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: [
      '**/.output/**',
      '**/.expo/**',
      'dist/**',
      'node_modules/**',
      'apps/web/src/routeTree.gen.ts',
      'convex/_generated/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...convexPlugin.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
  prettier,
)
