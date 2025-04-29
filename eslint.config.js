// ESLint v9 config file
import eslint from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin' // スタイリスティックプラグインを追加
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import importPlugin from 'eslint-plugin-import'

export default [
  // グローバル設定
  {
    ignores: ['node_modules/**', 'dist/**', '.vscode/**'],
  },
  // JS共通設定
  eslint.configs.recommended,
  // スタイリスティックのおすすめ設定を追加
  stylistic.configs.recommended,
  // Node.js環境設定（グローバル変数を許可）
  {
    languageOptions: {
      globals: {
        // Node.js グローバル
        console: 'readonly',
        process: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        Buffer: 'readonly',
        module: 'readonly',
        require: 'readonly',
        // DOM グローバル (念のため)
        document: 'readonly',
        window: 'readonly',
      },
    },
  },
  stylistic.configs.customize({}),
  // TypeScript設定
  {
    files: ['**/*.ts'],
    plugins: {
      '@typescript-eslint': tseslint,
      import: importPlugin,
      '@stylistic': stylistic, // スタイリスティックプラグインを登録
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
    rules: {
      // エラー防止のルール
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'no-unused-vars': 'off', // TypeScriptの方を使う
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      // コード品質向上のルール
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import/no-unresolved': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
  // JS/JSX設定
  {
    files: ['**/*.js'],
    plugins: {
      import: importPlugin,
      '@stylistic': stylistic, // JSファイルにもスタイリスティックプラグインを登録
    },
    rules: {
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },
]
