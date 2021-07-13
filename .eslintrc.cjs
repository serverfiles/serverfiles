/*
 *  ESLint run control for serverfiles CLI.
 *  Created On 13 July 2021
 */

module.exports = {
    env: {
        es2021: true,
        node: true,
    },
    extends: ['eslint:recommended', 'plugin:prettier/recommended'],
    plugins: ['prettier'],
    rules: {
        indent: ['error', 4],
        'linebreak-style': ['error', 'unix'],
        quotes: ['off', 'single'],
        semi: ['error', 'never'],
        'prettier/prettier': 'error',
    },
}
