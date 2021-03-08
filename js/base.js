/* 
    © 2021 KondaSoft
    https://www.kondasoft.com
*/

// Detect JavaScript
document.documentElement.classList.remove('no-js');
document.documentElement.classList.add('js');

// Detect touch
if ('ontouchstart' in window || navigator.maxTouchPoints) {
    document.documentElement.classList.remove('no-touch');
    document.documentElement.classList.add('touch');
}

// init Bootstrap tooltips
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));

tooltipTriggerList.map(function(tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
});
