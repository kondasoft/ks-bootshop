/* 
    © 2021 KondaSoft
    https://www.kondasoft.com
*/

// Define elements
const formEl = document.querySelector('form[action="/cart/add"]');

if (formEl) {
    formEl.addEventListener('submit', (e) => {
        e.preventDefault();

        // Define elements
        const variantsJSON          = JSON.parse(formEl.closest('.product').dataset.variantsJson);
        const optionSelectors       = formEl.getElementsByClassName('option-select');
        const addToCartBtnEl        = formEl.closest('.product').querySelector('.add-to-cart-btn');
        const addToCartIconCart     = addToCartBtnEl.querySelector('.add-to-cart-btn-icon-cart');
        const addToCartIconLoading  = addToCartBtnEl.querySelector('.add-to-cart-btn-icon-loading');
        const addToCartTextEl       = addToCartBtnEl.querySelector('.add-to-cart-btn-text');
        const quantityEl            = formEl.querySelector('#qty');
        const cartNavItem           = document.querySelector('#cart-nav-item');
        const productTitle          = formEl.closest('.product').dataset.productTitle;
        const featuredImageSrc      = formEl.closest('.product').dataset.featuredImageSrc;

        // Indicate loading
        addToCartBtnEl.disabled = true;
        addToCartIconCart.classList.add('d-none');
        addToCartIconLoading.classList.remove('d-none');
        addToCartTextEl.innerHTML = window.theme.i18n.general.loading;

        // Get selected options so that we can find the selected variant
        let selectedOptions = [];
            
        Array.from(optionSelectors).forEach(el => {
            selectedOptions.push(el.value);
        });
        
        // Get selected variant based on options above
        let selectedVariant;

        variantsJSON.forEach(el => {
            if (el.title.includes(selectedOptions.join(' / '))) {
                selectedVariant = el;
            }
        });

        // Add product to cart
        fetch('/cart/add.js', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                items: [
                    {
                        id: selectedVariant.id,
                        quantity: quantityEl.value || 1
                    }
                ]
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);

                // Disable loading
                addToCartBtnEl.disabled = false;
                addToCartIconCart.classList.remove('d-none');
                addToCartIconLoading.classList.add('d-none');
                addToCartTextEl.innerHTML = window.theme.i18n.product.add_to_cart;

                const toastEl = document.querySelector('#toast');

                // Product was successfully added to cart
                if (data.items) {
                    
                    // Build toast
                    toastEl.querySelector('.toast-header strong').innerHTML = `
                        ${window.theme.i18n.product.added_to_cart}
                    `;

                    toastEl.querySelector('.toast-body').innerHTML = `
                        <div class="d-flex align-items-center mb-0">
                            <img 
                                class="me-2 ${toastEl.dataset.imgThumbnail ? 'img-thumbnail' : 'rounded'}" 
                                src="${Shopify.resizeImage(selectedVariant.featured_image?.src || featuredImageSrc, `${toastEl.dataset.imgWidth}x${toastEl.dataset.imgHeight}_crop_center`)}" 
                                alt="${selectedVariant.featured_image?.alt}" 
                                width="${toastEl.dataset.imgWidth}" 
                                height="${toastEl.dataset.imgHeight}" 
                                style="object-fit: cover">
                            <div>
                                <h4 class="h6 mb-1">
                                    ${productTitle}
                                </h4>
                                <span class="mt-n1 mb-0 text-muted ${selectedVariant.title == 'Default Title' ? 'd-none' : 'd-block'}">
                                    ${selectedVariant.title}
                                </span>
                                <p class="product-price text-muted mb-0">
                                    ${quantityEl.value || 1} x
                                    <span class="price">
                                        ${Shopify.formatMoney(selectedVariant.price)}
                                    </span>
                                </p>
                            </div>
                        </div>
                    `;

                    toastEl.querySelector('.toast-footer').innerHTML = `
                        <a 
                            href="/cart" 
                            class="btn w-100 ${toastEl.dataset.btnColor} ${toastEl.dataset.btnSize}">
                            ${window.theme.i18n.product.view_cart}
                        </a>
                    `;

                    // Update cart on navbar
                    fetch(window.location)
                        .then(res => res.text())
                        .then(data => {
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(data, 'text/html');

                            cartNavItem.innerHTML = doc.querySelector(`#${cartNavItem.id}`).innerHTML;
                        });

                }

                // Error adding product to cart
                else {
                    const status = data.status;
                    const message = data.message;
                    const description = data.description;

                    // Build toast
                    toastEl.querySelector('.toast-header strong').innerHTML = `
                        ${message} (Status: ${status})
                    `;

                    toastEl.querySelector('.toast-body').innerHTML = `
                        <p class="mb-0">
                            ${description ?? ''}
                        </p>
                    `;

                    toastEl.querySelector('.toast-footer').innerHTML = `
                        <a 
                            href="/cart" 
                            class="btn w-100 ${toastEl.dataset.btnColor} ${toastEl.dataset.btnSize}">
                            ${window.theme.i18n.product.view_cart}
                        </a>
                    `;

                    toastEl.querySelector('.toast-header strong').classList.add('text-danger');
                }

                // Display toast to the visitor
                const toast = new bootstrap.Toast(toastEl);
                toast.show();

            });
    });
}

