/*
    © 2021 Firetheme.com
*/

//
// Init Bootstrap tooltips
//
document.querySelectorAll('[data-bs-toggle="tooltip"]')
    .forEach((el) => new bootstrap.Tooltip(el));

//
// Shopify's callenge page - Add BS classes
//
(() => {
    const btn = document.querySelector('.btn.shopify-challenge__button')
    if (btn) {
        btn.classList.add('btn-primary')
    }
})();

//
// Shopify's errors message - Add BS classes
//
(() => {
    const errors = document.querySelector('.errors')
    if (errors) {
        errors.classList.add('alert', 'alert-danger')
        errors.querySelector('ul').classList.add('mb-0')
    }
})()

//
// Newsletter - Scroll to section after submit
//
if (window.location.href.indexOf('?customer_posted=true') > -1) {
    setTimeout(() => {
        document.querySelector('.newsletter-alert').scrollIntoView()
    }, 750)
}

//
// Blog - Filter by
//
document.querySelector('#blog-filter-by')?.addEventListener('change', (e) => {
    const params = window.location.href.split('?')[1]
    if (params) {
        window.location.href = `${e.target.value}?${params}`
    } else {
        window.location.href = e.target.value
    }
})

//
// Search Offcanvas - autofocus on search field
//
document.querySelector('#search-offcanvas')?.addEventListener('shown.bs.offcanvas', (e) => {
    e.target.querySelector('input[name="q"]').focus()
})

//
// Predictive Search
//
document.querySelector('#predictive-search-input')?.addEventListener('keydown', window.debounce((e) => {
    // console.log(e)
    const list = document.querySelector('#predictive-search-product-list')
    if (e.target.value.length === 0) {
        list.style.display = 'none'
    } else {
        fetch(`/search/suggest.json?q=${e.target.value}&resources[type]=product&resources[limit]=${e.target.dataset.limit}&resources[options][unavailable_products]=last`)
            .then(response => response.json())
            .then((data) => {
                console.log(data)
                const products = data.resources.results.products
                if (products.length > 0) {
                    let html = ''
                    products.forEach((product) => {
                        html += `
                            <li class="predictive-search-product-list-item row align-items-center mx-n2 mb-3">
                                <div class="col-4 px-2">
                                    <a href="${product.url}">
                                        <img 
                                            class="product-img img-fluid me-3 ${e.target.dataset.imgThumbnail ? 'img-thumbnail' : 'rouned'}"
                                            src="${window.resizeImage(product.featured_image.url, `${e.target.dataset.imgWidth}x${e.target.dataset.imgHeight}`, 'center')}"
                                            alt="${product.featured_image.alt}" 
                                            width="${e.target.dataset.imgWidth}"
                                            height="${e.target.dataset.imgHeight}">
                                    </a>
                                </div>
                                <div class="col-8 px-2">
                                    <h3 class="product-title h6 mb-1">
                                        <a href="${product.url}">
                                            ${product.title}
                                        </a>
                                    </h3>
                                    <p class="product-price mb-2">
                                        <s class="product-price-compare text-muted me-1 ${product.compare_at_price_min > 0 ? '' : 'd-none'}">
                                            <span class="visually-hidden">
                                                ${e.target.dataset.textOldPrice}
                                            </span>
                                            ${window.formatMoney(product.compare_at_price_min)}
                                        </s>
                                        <span class="product-price-final">
                                            <span class="price-from">
                                                ${e.target.dataset.textPriceFrom}
                                            </span>
                                            ${window.formatMoney(product.price)}
                                        </span>
                                    </p>
                                </div>
                            </li>
                        `
                        list.innerHTML = html
                        list.style.display = 'block'
                    })
                } else {
                    list.style.display = 'none'
                }
            })
    }
}, 200))
