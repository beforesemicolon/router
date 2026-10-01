import js from '@eslint/js'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import prettier from 'eslint-config-prettier'
import { defineConfig } from 'eslint/config'

export default defineConfig([
    { ignores: ['**/*.spec.ts'] },
    {
        files: ['src/**/*.{js,mjs,cjs,ts,tsx,mts,cts}'],
        extends: [
            js.configs.recommended,
            ...tsPlugin.configs['flat/recommended'],
            prettier,
        ],
        rules: {
            'no-prototype-builtins': 'off',
        },
    },
])
