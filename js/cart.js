/* 
    © 2021 KondaSoft
    https://www.kondasoft.com
*/

// Adjust sticky-top class for summary
function fixSummaryStickyTop() {
    const summaryEl = document.querySelector('#cart-summary');

    if (summaryEl && summaryEl.classList.contains('sticky-top')) {
        const navbarEl      = document.querySelector('#navbar.navbar-sticky');
        let navbarHeight    = 0;

        if (navbarEl) {
            navbarHeight = navbarEl.clientHeight;
        }

        summaryEl.style.top = navbarHeight + 20 + 'px';
        summaryEl.style.zIndex = 1019;
    }
}
fixSummaryStickyTop();

// Update quantity
function updateQuantityListeners() {
    const quantityFields = document.querySelectorAll('.product-item-qty');

    if (quantityFields.length > 0) {

        // Listen for change on option select fields
        Array.from(quantityFields).forEach(el => {
            el.addEventListener('change', () => {
                
                // Change product quantity
                fetch('/cart/change.js', {
                    method: 'post',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        line: el.dataset.line,
                        quantity: el.value
                    })
                })
                    .then(res => res.json())
                    .then(data => {
                        console.log(data);

                        // Update cart on navbar
                        fetch(window.location)
                            .then(res => res.text())
                            .then(data => {
                                const parser = new DOMParser();
                                const newDocument = parser.parseFromString(data, 'text/html');

                                document.querySelector('#shopify-section-cart-template').innerHTML = newDocument.querySelector('#shopify-section-cart-template').innerHTML;

                                fixSummaryStickyTop();
                                updateQuantityListeners();
                                removeProductListeners();
                            });
                    });
            });
        });
    }
}
updateQuantityListeners();

// Remove product
function removeProductListeners() {
    const removeButtons = document.querySelectorAll('.product-item-remove');

    if (removeButtons.length > 0) {

        // Listen for change on option select fields
        Array.from(removeButtons).forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();

                el.disabled = true;
                
                // Change product quantity
                fetch('/cart/change.js', {
                    method: 'post',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        line: el.dataset.line,
                        quantity: 0
                    })
                })
                    .then(res => res.json())
                    .then(data => {
                        console.log(data);

                        // Update cart on navbar
                        fetch(window.location)
                            .then(res => res.text())
                            .then(data => {
                                const parser = new DOMParser();
                                const newDocument = parser.parseFromString(data, 'text/html');

                                document.querySelector('#shopify-section-cart-template').innerHTML = newDocument.querySelector('#shopify-section-cart-template').innerHTML;

                                fixSummaryStickyTop();
                                updateQuantityListeners();
                                removeProductListeners();
                            });
                    });
            });
        });
    }
}
removeProductListeners();

// Listen for Shopify theme editor changes
// https://help.shopify.com/en/themes/development/sections/integration-with-theme-editor
document.addEventListener('shopify:section:load', function(event) {
    if (event.detail.sectionId === 'cart-template') {
        fixSummaryStickyTop();
        updateQuantityListeners();
        removeProductListeners();
    }
});
