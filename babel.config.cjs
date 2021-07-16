module.exports = {
    plugins: [require('@babel/plugin-syntax-top-level-await')],
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    esmodules: true,
                },
            },
        ],
    ],
}
