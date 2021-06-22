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
