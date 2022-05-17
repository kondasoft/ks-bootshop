/*
    © 2022 KondaSoft.com
    https://www.kondasoft.com
*/

// Ajax 'Add To Cart' (ATC) forms
window.onSubmitAtcForm = async (form, event) => {
    event.preventDefault()

    const btn = form.querySelector('button[name="add"]')
    btn.innerHTML = `
        <div class="spinner-border spinner-border-sm" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    `

    await fetch('/cart/add.js', { method: 'POST', body: new FormData(form) })

    btn.innerHTML = window.themeStrings.addToCart

    if (document.querySelector('#offcanvas-cart')) {
        bootstrap.Offcanvas.getOrCreateInstance('#offcanvas-cart').show()
    }

    window.refreshCartContents()
}

// Product Options - listen for onchange events
window.onChangeProductOption = async (input) => {
    const productWrapper = input.closest('.product')
    const addToCartBtn = productWrapper.querySelector('[name="add"]')

    const response = await fetch(`/products/${input.dataset.productHandle}.js`)
    const productData = await response.json()

    const productOptions = []

    productWrapper.querySelectorAll('.product-option').forEach(el => {
        productOptions.push(el.value)
    })

    const selectedVariant = productData.variants.find(variant =>
        variant.title.includes(productOptions.toString().replace(',', ' / '))
    )

    console.log(selectedVariant)

    if (selectedVariant) {
        productWrapper.querySelector('[name="id"]').value = selectedVariant.id

        if (selectedVariant.available) {
            addToCartBtn.disabled = false
            addToCartBtn.innerHTML = window.themeStrings.addToCart
        } else {
            addToCartBtn.disabled = true
            addToCartBtn.innerHTML = window.themeStrings.soldOut
        }

        if (selectedVariant.compare_at_price) {
            productWrapper.querySelector('.product-price-compare').style.display = 'inline-block'
            productWrapper.querySelector('.product-price-compare s').textContent = window.formatMoney(selectedVariant.compare_at_price)
            productWrapper.querySelector('.product-price-final').classList.add('text-success')
            productWrapper.querySelector('.product-price-final').textContent = window.formatMoney(selectedVariant.price)
        } else {
            productWrapper.querySelector('.product-price-compare').style.display = 'none'
            productWrapper.querySelector('.product-price-compare s').textContent = ''
            productWrapper.querySelector('.product-price-final').classList.remove('text-success')
            productWrapper.querySelector('.product-price-final').textContent = window.formatMoney(selectedVariant.price)
        }

        bootstrap.Carousel.getOrCreateInstance('#product-carousel')
            ?.to(selectedVariant.featured_media.position - 1)

        const url = new URL(window.location)
        url.searchParams.set('variant', selectedVariant.id)
        window.history.replaceState({}, '', url)
    } else {
        addToCartBtn.disabled = true
        addToCartBtn.innerHTML = window.themeStrings.unavailable
    }
}

// 'Buy it now' buttons
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

// Product Carousel - Sticky position on scroll (only desktop)
const productCarousel = document.querySelector('#product-carousel.sticky-top')
if (productCarousel) {
    const navbarHeight = document.querySelector('#shopify-section-navbar.sticky-top').clientHeight || 0
    productCarousel.style.top = `${navbarHeight + 20}px`
    productCarousel.style.zIndex = '1'
}
