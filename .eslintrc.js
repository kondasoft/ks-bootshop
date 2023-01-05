module.exports = {
    env: {
        browser: true,
        es2021: true
    },
    extends: [
        'standard'
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    rules: {
        indent: ['error', 4]
    },
    globals: {
        Shopify: 'readonly',
        bootstrap: 'readonly',
        Splide: 'readonly',
        simpleParallax: 'readonly',
        SPR: 'readonly',
        GLightbox: 'readonly'
    }
}
