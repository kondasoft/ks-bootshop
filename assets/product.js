/*
    © 2021 Firetheme.com
*/

//
// Product options
//
document.querySelectorAll('.product-option select')
    .forEach((option) => {
        option.addEventListener('change', () => {
            const selectedOptions = Array.from(document.querySelectorAll('.product-option select'))
                .map((option) => option.value)
            const selectedVariant = window.product.variants.find((variant) =>
                JSON.stringify(variant.options) === JSON.stringify(selectedOptions))
            const addToCartBtn = document.querySelector('#add-to-cart-btn')
            addToCartBtn.setAttribute('data-variant-id', selectedVariant?.id || '')
            if (selectedVariant) {
                console.log(selectedVariant)
                if (selectedVariant.available) {
                    addToCartBtn.disabled = false
                    addToCartBtn.textContent = addToCartBtn.dataset.textAddToCart
                } else {
                    addToCartBtn.disabled = true
                    addToCartBtn.textContent = addToCartBtn.dataset.textSoldOut
                }
                document.querySelector('.product-price .product-price-final')
                    .textContent = window.formatMoney(selectedVariant.price)
                if (selectedVariant.compare_at_price) {
                    document.querySelector('.product-price .product-price-compare')
                        .textContent = window.formatMoney(selectedVariant.compare_at_price)
                    document.querySelector('.product-price .product-price-compare')
                        .classList.remove('d-none')
                } else {
                    document.querySelector('.product-price .product-price-compare')
                        .classList.add('d-none')
                }
                bootstrap.Carousel.getInstance(document.querySelector('#product-carousel'))
                    .to(selectedVariant?.featured_media?.position - 1 || 0)
                window.history.replaceState({}, '', `${window.product.url}?variant=${selectedVariant.id}`)
            } else {
                addToCartBtn.disabled = true
                addToCartBtn.textContent = addToCartBtn.dataset.textUnavailable
                window.history.replaceState({}, '', window.product.url)
            }
        })
    })

//
// Add to cart
//
document.querySelector('#add-to-cart-btn')
    ?.addEventListener('click', (e) => {
        const btn = e.target
        const savedBtnInnerHTML = btn.innerHTML
        btn.innerHTML = `
            <div class="spinner-border spinner-border-sm" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        `
        // Add variant to cart
        fetch('/cart/add.js', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: btn.dataset.variantId,
                quantity: btn.dataset.quantity
            })
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                btn.innerHTML = savedBtnInnerHTML
                btn.blur()
                // Display toast
                const toast = document.querySelector('#toast')
                toast.querySelector('.toast-title').innerHTML = `
                    ${btn.dataset.textAddedToCart}
                `
                toast.querySelector('.toast-body').innerHTML = `
                    <div class="d-flex align-items-center mb-3">
                        <a href="${data.url}">
                            <img 
                                class="product-img me-3 ${toast.dataset.imgThumbnail ? 'img-thumbnail' : 'rounded'}" 
                                src="${window.resizeImage(data.image, `${toast.dataset.imgWidth}x${toast.dataset.imgHeight}`, 'center')}" 
                                alt="" 
                                width="${toast.dataset.imgWidth}" 
                                height="${toast.dataset.imgHeight}" 
                                style="object-fit: cover">
                        </a>
                        <div>
                            <h4 class="product-title h6 mb-1">
                                ${data.product_title}
                            </h4>
                            <p class="product-variant-title mb-1 text-muted ${data.variant_title ? '' : 'd-none'}">
                                ${data.variant_title}
                            </p>
                            <p class="product-price mb-0">
                                ${btn.dataset.quantity} x <span class="">
                                    ${window.formatMoney(data.price)}
                                </span>
                            </p>
                        </div>
                    </div>
                    <a 
                        href="${btn.dataset.cartRouteUrl}" 
                        class="btn btn-primary btn-sm w-100">
                        ${btn.dataset.textViewCart}
                    </a>
                `
                // Toast.getInstance(toast)?.dispose()
                new bootstrap.Toast(toast).show()
            })
    })

//
// Related Products
// https://www.shopify.com/partners/blog/related-products
//
const recommendedProducts = document.querySelector('.product-recommendations')
if (recommendedProducts) {
    const { baseUrl, productId, limit } = recommendedProducts.dataset
    const url = `${baseUrl}?section_id=product-recommendations&product_id=${productId}&limit=${limit}`
    fetch(url)
        .then((response) => response.text())
        .then((data) => {
            recommendedProducts.parentElement.innerHTML = data
        })
}
