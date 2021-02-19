/* 
    © 2021 KondaSoft
    https://www.kondasoft.com
*/

// Handle sticky-top
var stickyNavbar = function () { 
    if (document.getElementById('navbar').classList.contains('navbar-sticky')) {
        document.getElementById('shopify-section-navbar')
            .classList.add('sticky-top');
    }
};

stickyNavbar();

// Listen for changes in Shopify Theme Editor
document.addEventListener('shopify:section:load', function (event) {    
    if (event.detail.sectionId === 'navbar') {
        stickyNavbar();
    }
});
