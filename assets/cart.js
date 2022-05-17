/*
    © 2022 KondaSoft.com
    https://www.kondasoft.com
*/

// Refresh cart contents (offcanvas cart, cart page, count badges, etc)
window.refreshCartContents = async () => {
    const offcanvasCart = document.querySelector('#offcanvas-cart')
    const cartBadges = document.querySelectorAll('.cart-badge')
    const cartSummary = document.querySelector('#template-cart-summary')

    offcanvasCart?.classList.add('loading')

    const respoonse = await fetch(window.location.href)
    const data = await respoonse.text()
    const parser = new DOMParser()
    const newDocument = parser.parseFromString(data, 'text/html')

    offcanvasCart?.querySelector('.offcanvas-body')
        .replaceWith(newDocument.querySelector('#offcanvas-cart .offcanvas-body'))
    offcanvasCart?.querySelector('.offcanvas-footer')
        .replaceWith(newDocument.querySelector('#offcanvas-cart .offcanvas-footer'))
    cartSummary?.querySelector('.card-body')
        .replaceWith(newDocument.querySelector('#template-cart-summary .card-body'))

    cartBadges.forEach((badge) => {
        badge.style.display = 'block'
        badge.textContent = newDocument.querySelector('.cart-badge').textContent
    })

    offcanvasCart?.classList.remove('loading')
}

// Quantity Inputs
window.onChangeCartQty = async (input) => {
    await fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: input.dataset.lineItemKey,
            quantity: input.value
        })
    })
    window.refreshCartContents()
}

// Cart note - Show button on keydown
window.showNoteButton = (input) => {
    input.closest('.cart-note-wrapper').querySelector('button').style.display = 'block'
}

// Cart note - Save note via ajax
window.saveCartNote = async (btn) => {
    btn.innerHTML = `
        <div class="spinner-border spinner-border-sm" role="status" style="width: 1rem; height: 1rem">
            <span class="visually-hidden">Loading...</span>
        </div>
    `

    const note = btn.closest('.cart-note-wrapper').querySelector('[name="note"]').value

    await fetch('/cart/update.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note })
    })

    btn.innerHTML = '✓'

    setTimeout(() => {
        btn.innerHTML = btn.dataset.text
    }, 2000)
}

// Checkout button - indicate loading on click
window.onCheckoutBtnClick = (btn) => {
    btn.style.height = btn.clientHeight + 'px'
    btn.innerHTML = `
        <div class="spinner-border spinner-border-sm" role="status" style="width: 1.2rem; height: 1.2rem">
            <span class="visually-hidden">Loading...</span>
        </div>
    `
}

// Summary card  - make it sticky on desktop
const summaryCard = document.querySelector('#template-cart-summary')
if (summaryCard) {
    if (window.matchMedia('min-width: 992px')) {
        const navbarHeight = document.querySelector('#shopify-section-navbar.sticky-top').clientHeight || 0
        summaryCard.style.position = 'sticky'
        summaryCard.style.top = `${navbarHeight + 20}px`
    }
}

// Offcanvas cart - open it with direct url (hash based)
if (window.location.hash.includes('#cart') && document.querySelector('#offcanvas-cart')) {
    bootstrap.Offcanvas.getOrCreateInstance('#offcanvas-cart').show()
}
