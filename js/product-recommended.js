/* 
    © 2021 KondaSoft
    https://www.kondasoft.com
*/

// https://www.shopify.com/partners/blog/related-products
var loadProductRecommendationsIntoSection = function() {

    // Look for an element with class 'product-recommendations'
    var productRecommendationsSection = document.querySelector('.recommended-products');
    
    if (productRecommendationsSection === null) { 
        return; 
    }

    // Read product id from data attribute
    var productId = productRecommendationsSection.dataset.productId;

    // Read limit from data attribute
    var limit = productRecommendationsSection.dataset.limit;

    // Build request URL
    var requestUrl = '/recommendations/products?section_id=product-recommended&limit='+limit+'&product_id='+productId;

    // Create request and submit it using Ajax
    var request = new XMLHttpRequest();
    request.open('GET', requestUrl);
    request.onload = function() {
        if (request.status >= 200 && request.status < 300) {
            var container = document.createElement('div');
            container.innerHTML = request.response;
            productRecommendationsSection.innerHTML = container.querySelector('.recommended-products').innerHTML;
        }
    };
    request.send();
};

// If your section has theme settings, the theme editor
// reloads the section as you edit those settings. When that happens, the
// recommendations need to be fetched again.
// See https://help.shopify.com/en/themes/development/sections/integration-with-theme-editor
document.addEventListener('shopify:section:load', function(event) {
    if (event.detail.sectionId === 'product-recommended') {
        loadProductRecommendationsIntoSection();
    }
});

// Fetching the recommendations on page load
loadProductRecommendationsIntoSection();