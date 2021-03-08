/* 
    © 2021 KondaSoft
    https://www.kondasoft.com
*/

// Define elements
const optionSelectors = document.getElementsByClassName('option-select');

if (optionSelectors.length > 0) {

    // Listen for change on option select fields
    Array.from(optionSelectors).forEach(el => {
        el.addEventListener('change', () => {
            let selectedOptions = [];
            
            // Get selected options
            Array.from(optionSelectors).forEach(el => {
                selectedOptions.push(el.value);
            });

            // Get selected variant based on selected options
            let selectedVariant;
            const variantsJSON = JSON.parse(el.closest('.product').dataset.variantsJson);

            variantsJSON.forEach(el => {
                if (el.title.includes(selectedOptions.join(' / '))) {
                    selectedVariant = el;
                }
            });

            console.log(selectedVariant);

            // Get elements that have to be updated on variant change
            const priceEl           = el.closest('.product').querySelector('.product-price');
            const addToCartBtnEl    = el.closest('.product').querySelector('.add-to-cart-btn');
            const addToCartTextEl   = addToCartBtnEl.querySelector('.add-to-cart-btn-text');
            const gallery           = el.closest('.product').querySelector('.product-carousel');

            // Variant exists
            if (selectedVariant) {

                // Update URL
                let params = new URLSearchParams(window.location.search);
                params.set('variant', selectedVariant.id);
                history.replaceState(null, null, `${location.pathname}?${params}`);

                // Update Compare at Price
                if (selectedVariant.compare_at_price > selectedVariant.price) {
                    priceEl.querySelector('.price-compare').classList.remove('d-none');
                    priceEl.querySelector('.price-compare').classList.add('d-inline-block');
                    priceEl.querySelector('.price-compare-text').innerHTML = Shopify.formatMoney(selectedVariant.compare_at_price);
                } else {
                    priceEl.querySelector('.price-compare').classList.remove('d-inline-block');
                    priceEl.querySelector('.price-compare').classList.add('d-none');
                    priceEl.querySelector('.price-compare-text').innerHTML = '';
                }

                // Update price
                priceEl.querySelector('.price').innerHTML = Shopify.formatMoney(selectedVariant.price);

                // Update gallery
                if (selectedVariant.featured_media) {
                    let selectedIndex = 0;

                    const carouselItems = gallery.querySelectorAll('.carousel-item');

                    Array.from(carouselItems).forEach((el, index) => {
                        if (el.dataset.mediaId == selectedVariant.featured_media.id) {
                            selectedIndex = index;
                        }
                    });

                    const carousel = new bootstrap.Carousel(gallery);

                    carousel.to(selectedIndex);
                    carousel.pause();
                }

                // Variant is available
                if (selectedVariant.available) {

                    // Update Add to cart button
                    addToCartBtnEl.disabled = false;
                    addToCartTextEl.innerHTML = window.theme.i18n.product.add_to_cart;
                }

                // Variant is sold-out
                else {

                    // Update Add to cart button
                    addToCartBtnEl.disabled = true;
                    addToCartTextEl.innerHTML = window.theme.i18n.product.sold_out;
                }
            } 

            // Variant is unavailable
            else {

                // Update Add to cart button
                addToCartBtnEl.disabled = true;
                addToCartTextEl.innerHTML = window.theme.i18n.product.unavailable;
            }
        });
    });
}
