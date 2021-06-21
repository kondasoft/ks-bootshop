/*
    © 2021 Firetheme.com
*/

// Quantity change
document.querySelectorAll('.cart-qty')
    .forEach((el) => {
        el.addEventListener('change', () => {
            fetch('/cart/change.js', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: el.dataset.lineItemKey,
                    quantity: el.value
                })
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log(data)
                    el.closest('.cart-product-list-item').querySelector('.product-price-final')
                        .textContent = window.formatMoney(data.items[el.dataset.index].final_line_price)
                    document.querySelector('#cart-subtotal-value')
                        .textContent = window.formatMoney(data.items_subtotal_price)
                    document.querySelectorAll('.cart-item-count')
                        .forEach((el2) => {
                            el2.textContent = data.item_count
                        })
                })
        })
    });

// Summary sticky top layout
(() => {
    const cartSummary = document.querySelector('#cart-summary.sticky-top')
    if (cartSummary) {
        const navbarHeight = document.querySelector('#shopify-section-navbar.sticky-top').clientHeight
        cartSummary.style.top = navbarHeight + 20 + 'px'
        cartSummary.style.zIndex = '1019'
    }
})()
