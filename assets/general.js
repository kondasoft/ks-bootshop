/*
    © 2022 KondaSoft.com
    https://www.kondasoft.com
*/

// Theme info in console
console.log('KS BootShop - Shopify Theme by KondaSoft.com | Learn more at https://www.kondasoft.com')

// Init Bootstrap tooltips
document.querySelectorAll('[data-bs-toggle="tooltip"]')
    .forEach((el) => new bootstrap.Tooltip(el))

// Init Bootstrap popovers
document.querySelectorAll('[data-bs-toggle="popover"]')
    .forEach((el) => new bootstrap.Popover(el))

// Shopify's callenge page - Add BS classes
document.querySelector('.btn.shopify-challenge__button')
    ?.classList.add('btn-primary')

// Shopify's errors messages - Add BS classes
const errors = document.querySelector('.errors')
if (errors) {
    errors.classList.add('alert', 'alert-danger')
}

// Debounce - helper function
// https://stackoverflow.com/a/42554614/5917894
window.debounce = (callback, wait = 200) => {
    let timeout
    return (...args) => {
        const context = this
        clearTimeout(timeout)
        timeout = setTimeout(() => callback.apply(context, args), wait)
    }
}

// Resize Shopify images - helper function
// https://gist.github.com/DanWebb/cce6ab34dd521fcac6ba
window.resizeImage = (src, size, crop = '') => src.replace(/_(pico|icon|thumb|small|compact|medium|large|grande|original|1024x1024|2048x2048|master)+\./g, '.')
    .replace(/\.jpg|\.png|\.gif|\.jpeg/g, (match) => {
        if (crop.length) {
            // eslint-disable-next-line no-param-reassign
            crop = `_crop_${crop}`
        }
        return `_${size}${crop}${match}`
    })

// Format money - helper function
// https://gist.github.com/stewartknapman/8d8733ea58d2314c373e94114472d44c
window.formatMoney = (cents, format) => {
    if (typeof cents === 'string') {
        cents = cents.replace('.', '')
    }

    let value = ''
    const placeholderRegex = /\{\{\s*(\w+)\s*\}\}/
    const formatString = (format || window.money_format)

    function defaultOption (opt, def) {
        return (typeof opt === 'undefined' ? def : opt)
    }

    function formatWithDelimiters (number, precision, thousands, decimal) {
        precision = defaultOption(precision, 2)
        thousands = defaultOption(thousands, ',')
        decimal = defaultOption(decimal, '.')

        if (Number.isNaN(number) || number == null) { return 0 }

        number = (number / 100.0).toFixed(precision)

        const parts = number.split('.')
        const dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands)
        cents = parts[1] ? (decimal + parts[1]) : ''

        return dollars + cents
    }

    switch (formatString.match(placeholderRegex)[1]) {
    case 'amount': value = formatWithDelimiters(cents, 2); break
    case 'amount_no_decimals': value = formatWithDelimiters(cents, 0); break
    case 'amount_with_comma_separator': value = formatWithDelimiters(cents, 2, '.', ','); break
    case 'amount_no_decimals_with_comma_separator': value = formatWithDelimiters(cents, 0, '.', ','); break
    }

    return formatString.replace(placeholderRegex, value)
}

// Share links using WebShare API
window.onLinkShare = (btn, e) => {
    if (navigator.share) {
        navigator.share({
            title: btn.dataset.shareTitle,
            url: btn.dataset.shareUrl
        })
    } else {
        const popover = bootstrap.Popover.getOrCreateInstance(btn, {
            content: `
                <div class="input-group input-group-sm">
                    <input type="text" class="form-control" value="${btn.dataset.shareUrl}">
                    <button id="btn-share-copy" class="btn btn-outline-secondary" type="button">${btn.dataset.textCopy}</button>
                </div>
            `,
            html: true,
            sanitize: false,
            placement: 'top'
        })

        popover.show()

        document.querySelector('#btn-share-copy')?.addEventListener('click', (e) => {
            navigator.clipboard.writeText(btn.dataset.shareUrl)
            e.target.textContent = btn.dataset.textCopied
        })

        setTimeout(() => {
            popover.hide()
            btn.blur()
        }, 4000)
    }
}

// Shopify's recommended products
// https://shopify.dev/themes/product-merchandising/recommendations
const initRecommendedProducts = async () => {
    const section = document.querySelector('.recommended-products')

    const {
        sectionId, baseUrl, productId, limit
    } = section.dataset

    const url = `${baseUrl}?section_id=${sectionId}&product_id=${productId}&limit=${limit}`

    const response = await fetch(url)
    const data = await response.text()

    section.closest('.shopify-section').outerHTML = data
}
initRecommendedProducts()

// Listen for changes in the Shopify Theme Editor
document.addEventListener('shopify:section:load', (e) => {
    if (e.target.querySelector('.recommended-products')) {
        initRecommendedProducts()
    }
})
