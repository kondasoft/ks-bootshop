/*
    © 2022 KondaSoft.com
    https://www.kondasoft.com
*/

// Refresh cart contents (offcanvas cart, cart page, count badges, etc)
window.refreshCartContents = async (response) => {
    console.log(response)

    const offcanvasCart = document.querySelector('#offcanvas-cart')

    offcanvasCart?.classList.add('loading')

    const respoonse = await fetch(window.location.href)
    const text = await respoonse.text()
    const newDocument = new DOMParser().parseFromString(text, 'text/html')

    offcanvasCart?.querySelector('.offcanvas-body')
        .replaceWith(newDocument.querySelector('#offcanvas-cart .offcanvas-body'))
    offcanvasCart?.querySelector('.offcanvas-footer')
        .replaceWith(newDocument.querySelector('#offcanvas-cart .offcanvas-footer'))

    document.querySelector('#cart')?.replaceWith(newDocument.querySelector('#cart'))

    document.querySelectorAll('.cart-count-badge').forEach((badge) => {
        badge.textContent = newDocument.querySelector('.cart-count-badge').textContent
        badge.removeAttribute('hidden')
    })

    offcanvasCart?.classList.remove('loading')

    window.dispatchEvent(new Event('updated.ks.cart'))

    if (response.ok) {
        if (response.url.includes('add.js')) {
            offcanvasCart?.querySelector('#offcanvas-cart-alert-add').removeAttribute('hidden')
        } else {
            offcanvasCart?.querySelector('#offcanvas-cart-alert-updated').removeAttribute('hidden')
        }
    } else {
        const data = await response.json()
        const alert = document.querySelector('#offcanvas-cart-alert-error')
        alert.querySelector('span').textContent = `${data.message} - ${data.description}`
        alert.removeAttribute('hidden')
    }
}

// Quantity Inputs
window.onChangeCartQty = async (input) => {
    const response = await fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: input.dataset.lineItemKey,
            quantity: input.value
        })
    })
    window.refreshCartContents(response)
}

// Remove Buttons
window.onRemoveCartItem = async (btn) => {
    const response = await fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: btn.dataset.lineItemKey,
            quantity: 0
        })
    })
    window.refreshCartContents(response)
}

// Checkout button - indicate loading on click
window.onClickCheckoutBtn = (btn) => {
    btn.style.height = btn.clientHeight + 'px'
    btn.innerHTML = `
        <div class="spinner-border spinner-border-sm" role="status" style="width: 1.2rem; height: 1.2rem">
            <span class="visually-hidden">Loading...</span>
        </div>
    `
}

// Summary card on the cart page - sticky on desktop
const initStickySummaryCard = () => {
    const card = document.querySelector('#cart-summary')

    if (!card) return

    if (window.matchMedia('max-width: 991px').matches) return

    const navbarHeight = document.querySelector('#shopify-section-navbar.sticky-top').clientHeight || 0
    card.style.position = 'sticky'
    card.style.top = `${navbarHeight + 20}px`
}
initStickySummaryCard()

window.addEventListener('updated.ks.cart', () => {
    initStickySummaryCard()
})
