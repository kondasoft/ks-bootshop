/*
    © 2022 KondaSoft.com
    https://www.kondasoft.com
*/

/*
    Announcement bar
*/
document.addEventListener('shopify:block:select', (event) => {
    const carousel = event.target.closest('.announcement-bar .carousel')

    if (carousel) {
        bootstrap.Carousel.getOrCreateInstance(carousel, { ride: false })
            .to(event.target.dataset.index)
    }
})

/*
    Carousel
*/
document.addEventListener('shopify:block:select', (event) => {
    const carousel = event.target.closest('.carousel')

    if (carousel) {
        bootstrap.Carousel.getOrCreateInstance(carousel, { ride: false })
            .to(event.target.dataset.index)
    }
})

/*
    Featured Products
*/

/*
    Recommended Products
    https://shopify.dev/themes/product-merchandising/recommendations
*/
const initRecommendedProducts = async () => {
    const section = document.querySelector('.recommended-products')

    if (!section) return

    const { sectionId, baseUrl, productId, limit } = section.dataset
    const url = `${baseUrl}?section_id=${sectionId}&product_id=${productId}&limit=${limit}`
    const response = await fetch(url)
    const data = await response.text()

    section.closest('.shopify-section').outerHTML = data

    const customEvent = new CustomEvent('init.ks.recommended_products')
    window.dispatchEvent(customEvent)
}
initRecommendedProducts()

// Listen for changes in the Shopify Theme Editor
document.addEventListener('shopify:section:load', (e) => {
    if (e.target.querySelector('.recommended-products')) {
        initRecommendedProducts()
    }
})
