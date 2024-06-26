module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    ignorePatterns: ['*.spec.ts'],
    root: true,
    rules: {
        'no-prototype-builtins': ['off'],
    },
}
