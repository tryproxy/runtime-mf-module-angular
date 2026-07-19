// @ts-check
import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';
import stylistic from '@stylistic/eslint-plugin';
import importPlugin from 'eslint-plugin-import-x';
import globals from 'globals';

export default defineConfig([
  {
    ignores: ['dist/**', 'coverage/**', '.artifacts/**', 'node_modules/**'],
  },
  {
    files: ['src/**/*.ts', 'e2e/**/*.ts'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      sourceType: 'module',
      parserOptions: {
        projectService: true,
      },
    },
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    plugins: {
      '@stylistic': stylistic,
      import: importPlugin,
    },
    processor: angular.processInlineTemplates,
    rules: {
      // angular
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      '@angular-eslint/no-lifecycle-call': 'error',
      '@angular-eslint/consistent-component-styles': 'warn',
      '@angular-eslint/prefer-signals': 'warn',
      '@angular-eslint/prefer-output-readonly': 'warn',
      '@angular-eslint/no-empty-lifecycle-method': 'warn',
      '@typescript-eslint/no-useless-constructor': ['error'],
      '@typescript-eslint/array-type': ['error', { default: 'array', readonly: 'array' }],
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        { ignoredMethodNames: ['constructor', 'transform'] },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/naming-convention': [
        'warn',
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
        },
      ],
      '@typescript-eslint/no-empty-function': 'warn',
      '@typescript-eslint/no-empty-object-type': 'error',
      curly: ['error', 'all'],
      complexity: ['error', 20],
      'max-classes-per-file': ['error', 1],
      'prefer-const': 'error',
      'prefer-arrow-callback': 'error',
      'no-confusing-arrow': ['error', { allowParens: true }],
      'sort-imports': [
        'error',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
          allowSeparatedGroups: true,
        },
      ],
      'no-implicit-coercion': ['error', { allow: ['!!'] }],
      eqeqeq: ['error', 'always'],
      'import/extensions': [
        'error',
        {
          ts: 'never',
          config: 'off',
          routes: 'off',
          model: 'off',
          pipe: 'off',
          directive: 'off',
          service: 'off',
          component: 'off',
          resolver: 'off',
          mock: 'off',
          fixture: 'off',
          token: 'off',
        },
      ],
      'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
      'import/no-cycle': ['error', { maxDepth: Infinity }],
      'import/first': 'error',
      '@stylistic/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: ['const', 'let'], next: '*' },
        {
          blankLine: 'any',
          prev: ['const', 'let'],
          next: ['const', 'let'],
        },
        { blankLine: 'always', prev: ['case', 'default'], next: '*' },
        { blankLine: 'always', prev: 'import', next: '*' },
        { blankLine: 'any', prev: 'import', next: 'import' },
      ],
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {
      '@angular-eslint/template/cyclomatic-complexity': ['warn', { maxComplexity: 10 }],
      '@angular-eslint/template/eqeqeq': 'error',
      '@angular-eslint/template/prefer-self-closing-tags': 'warn',
    },
  },
  {
    files: ['playwright.config.ts', 'commitlint.config.js', 'eslint.config.js', 'vitest.config.ts'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    rules: {
      '@typescript-eslint/consistent-type-imports': 'warn',
    },
  },
]);
