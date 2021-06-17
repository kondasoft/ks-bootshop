/*
    © 2021 Firetheme.com
*/

// Shopify resize image
// https://gist.github.com/DanWebb/cce6ab34dd521fcac6ba
window.resizeImage = (src, size, crop = '') => src.replace(/_(pico|icon|thumb|small|compact|medium|large|grande|original|1024x1024|2048x2048|master)+\./g, '.')
    .replace(/\.jpg|\.png|\.gif|\.jpeg/g, (match) => {
        if (crop.length) {
            // eslint-disable-next-line no-param-reassign
            crop = `_crop_${crop}`
        }
        return `_${size}${crop}${match}`
    })

// Shopify format money
// https://gist.github.com/stewartknapman/8d8733ea58d2314c373e94114472d44c
window.formatMoney = (cents, format) => {
    if (typeof cents === 'string') {
        // eslint-disable-next-line no-param-reassign
        cents = cents.replace('.', '')
    }
    let value = ''
    const placeholderRegex = /\{\{\s*(\w+)\s*\}\}/
    const formatString = (format || window.money_format)

    function defaultOption (opt, def) {
        return (typeof opt === 'undefined' ? def : opt)
    }

    function formatWithDelimiters (number, precision, thousands, decimal) {
        // eslint-disable-next-line no-param-reassign
        precision = defaultOption(precision, 2)
        // eslint-disable-next-line no-param-reassign
        thousands = defaultOption(thousands, ',')
        // eslint-disable-next-line no-param-reassign
        decimal = defaultOption(decimal, '.')

        if (Number.isNaN(number) || number == null) { return 0 }

        // eslint-disable-next-line no-param-reassign
        number = (number / 100.0).toFixed(precision)

        const parts = number.split('.')
        // eslint-disable-next-line prefer-template
        const dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands)
        // eslint-disable-next-line no-param-reassign
        cents = parts[1] ? (decimal + parts[1]) : ''

        return dollars + cents
    }

    // eslint-disable-next-line default-case
    switch (formatString.match(placeholderRegex)[1]) {
    case 'amount': value = formatWithDelimiters(cents, 2); break
    case 'amount_no_decimals': value = formatWithDelimiters(cents, 0); break
    case 'amount_with_comma_separator': value = formatWithDelimiters(cents, 2, '.', ','); break
    case 'amount_no_decimals_with_comma_separator': value = formatWithDelimiters(cents, 0, '.', ','); break
    }

    return formatString.replace(placeholderRegex, value)
}
