/*
    © 2022 KondaSoft.com
    https://www.kondasoft.com
*/

/*
    Main 'Add to cart' (ATC) form
*/
window.onSubmitAtcForm = async (form, event) => {
    event.preventDefault()

    const btn = form.querySelector('.btn-atc')

    btn.innerHTML = `
        <div class="spinner-border spinner-border-sm" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    `

    form.classList.add('loading')

    const response = await fetch('/cart/add.js', { method: 'POST', body: new FormData(form) })

    form.classList.remove('loading')
    btn.innerHTML = window.theme.product.addedToCart

    setTimeout(() => {
        btn.innerHTML = btn.dataset.textAddToCart
    }, 2000)

    window.refreshCartContents(response)

    bootstrap.Offcanvas.getOrCreateInstance('#offcanvas-cart').show()
}

/*
    Product options selector - Listen for change events
    Works only in the product page
*/
window.onChangeProductOption = async (input) => {
    const selectedOptions = []

    input.closest('form').querySelectorAll('.product-option').forEach(elem => {
        if (elem.type === 'radio') {
            if (elem.checked) {
                selectedOptions.push(elem.value)
            }
        } else {
            selectedOptions.push(elem.value)
        }
    })

    const selectedVariant = window.productVariants.find(variant =>
        JSON.stringify(variant.options) === JSON.stringify(selectedOptions)
    )

    console.log(selectedVariant)

    const btn = input.closest('form').querySelector('.btn-atc')

    if (selectedVariant) {
        input.closest('form').querySelector('[name="id"]').value = selectedVariant.id

        if (selectedVariant.available) {
            btn.disabled = false
            btn.innerHTML = window.theme.product.addToCart
        } else {
            btn.disabled = true
            btn.innerHTML = window.theme.product.soldOut
        }

        if (selectedVariant.compare_at_price) {
            input.closest('#product-content').querySelector('.product-price').innerHTML = `
                <span class="product-price-compare text-muted me-3">
                    <span class="visually-hidden">
                        ${window.theme.product.priceFrom} &nbsp;
                    </span>
                    <s>
                        ${Shopify.formatMoney(selectedVariant.compare_at_price)}
                    </s>
                </span>
                <span class="product-price-final">
                    <span class="visually-hidden">
                        ${window.theme.product.priceSale} &nbsp;
                    </span>
                    ${Shopify.formatMoney(selectedVariant.price)}
                </span>
            `
        } else {
            input.closest('#product-content').querySelector('.product-price').innerHTML = `
                <span class="product-price-final">
                    ${Shopify.formatMoney(selectedVariant.price)}
                </span>
            `
        }
        if (selectedVariant.available && selectedVariant.compare_at_price) {
            input.closest('#product-content').querySelector('.product-price').insertAdjacentHTML('beforeend', `
                <span class="price-badge-sale badge">
                    ${window.theme.product.save}: ${Math.round((1 - (selectedVariant.price / selectedVariant.compare_at_price)) * 100)}%
                </span>    
            `)
        } else if (!selectedVariant.available) {
            input.closest('#product-content').querySelector('.product-price').insertAdjacentHTML('beforeend', `
                <span class="price-badge-sold-out badge">
                    ${window.theme.product.soldOut}
                </span>
            `)
        }

        const url = new URL(window.location)
        url.searchParams.set('variant', selectedVariant.id)
        window.history.replaceState({}, '', url)

        const customEvent = new CustomEvent('variantChange.ks.product', {
            detail: selectedVariant
        })
        window.dispatchEvent(customEvent)
    } else {
        btn.disabled = true
        btn.innerHTML = window.theme.product.unavailable
    }
}

/*
    Product Gallery
*/
const initProductGallery = () => {
    const wrapper = document.querySelector('#product-gallery')

    if (!wrapper) return

    window.addEventListener('variantChange.ks.product', (event) => {
        const selectedVariant = event.detail

        if (selectedVariant.featured_media) {
            bootstrap.Carousel.getOrCreateInstance('#product-gallery').to(selectedVariant.featured_media.position - 1)
        }
    }, false)

    if (window.matchMedia('(min-width: 992px)').matches) {
        const navbarHeight = document.querySelector('#shopify-section-navbar.sticky-top').clientHeight || 0
        wrapper.style.position = 'sticky'
        wrapper.style.top = `${navbarHeight + 20}px`
        wrapper.style.zIndex = '1'
    }
}
initProductGallery()

document.addEventListener('shopify:section:load', (e) => {
    if (e.target.querySelector('#product-gallery')) {
        initProductGallery()
    }
})

/*
    'Buy it now' button
*/
window.onClickBuyBtn = (btn) => {
    btn.innerHTML = `
        <div class="spinner-border spinner-border-sm" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    `
    const form = btn.closest('form')
    const variantId = form.querySelector('[name="id"]').value
    const qty = Number(form.querySelector('input[name="quantity"]').value || 1)
    window.location.href = `/cart/${variantId}:${qty}`
}
