/*
    © 2022 KondaSoft.com
    https://www.kondasoft.com
*/

// Shopify's money format
Shopify.formatMoney = function (cents, format) {
    if (typeof cents === 'string') {
        cents = cents.replace('.', '')
    }

    let value = ''
    const placeholderRegex = /\{\{\s*(\w+)\s*\}\}/
    const formatString = (format || this.money_format)

    function defaultOption (opt, def) {
        return (typeof opt === 'undefined' ? def : opt)
    }

    function formatWithDelimiters (number, precision, thousands, decimal) {
        precision = defaultOption(precision, 2)
        thousands = defaultOption(thousands, ',')
        decimal = defaultOption(decimal, '.')

        if (isNaN(number) || number == null) {
            return 0
        }

        number = (number / 100.0).toFixed(precision)

        const parts = number.split('.')
        const dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands)
        const cents = parts[1] ? (decimal + parts[1]) : ''

        return dollars + cents
    }

    switch (formatString.match(placeholderRegex)[1]) {
    case 'amount':
        value = formatWithDelimiters(cents, 2)
        break
    case 'amount_no_decimals':
        value = formatWithDelimiters(cents, 0)
        break
    case 'amount_with_comma_separator':
        value = formatWithDelimiters(cents, 2, '.', ',')
        break
    case 'amount_no_decimals_with_comma_separator':
        value = formatWithDelimiters(cents, 0, '.', ',')
        break
    }

    return formatString.replace(placeholderRegex, value)
}

// Resize Shopify images - helper function
// https://gist.github.com/DanWebb/cce6ab34dd521fcac6ba
Shopify.resizeImage = (src, size, crop = '') => src.replace(/_(pico|icon|thumb|small|compact|medium|large|grande|original|1024x1024|2048x2048|master)+\./g, '.')
    .replace(/\.jpg|\.png|\.gif|\.jpeg/g, (match) => {
        if (crop.length) {
            // eslint-disable-next-line no-param-reassign
            crop = `_crop_${crop}`
        }
        return `_${size}${crop}${match}`
    })

// Debounce - helper function
window.debounce = (callback, wait = 200) => {
    let timeout
    return (...args) => {
        const context = this
        clearTimeout(timeout)
        timeout = setTimeout(() => callback.apply(context, args), wait)
    }
}

// Throttle - helper function
window.throttle = (callback, timeFrame = 200) => {
    let lastTime = 0
    return function () {
        const now = Date.now()
        if (now - lastTime >= timeFrame) {
            callback()
            lastTime = now
        }
    }
}

// Share links using WebShare API
window.onLinkShare = (btn, e) => {
    if (navigator.share) {
        navigator.share({
            title: btn.dataset.shareTitle,
            url: window.location.href
        })
    } else {
        const popover = bootstrap.Popover.getOrCreateInstance(btn, {
            content: `
                <div class="input-group input-group-sm">
                    <input type="text" class="form-control" value="${window.location.href}">
                    <button id="btn-share-copy" class="btn btn-outline-secondary" type="button">${btn.dataset.textCopy}</button>
                </div>
            `,
            html: true,
            sanitize: false,
            placement: 'top'
        })

        popover.show()

        document.querySelector('#btn-share-copy')?.addEventListener('click', (e) => {
            navigator.clipboard.writeText(window.location.href)
            e.target.textContent = btn.dataset.textCopied
        })

        setTimeout(() => {
            popover.hide()
            btn.blur()
        }, 4000)
    }
}

// Search page - set selected value for the types select field
const initSearchPageSetSelected = () => {
    const select = document.querySelector('#search-header .form-select')

    if (!select) return

    const params = new URLSearchParams(location.search)
    const type = params.get('type')

    if (!type) return

    select.value = type
}
initSearchPageSetSelected()
