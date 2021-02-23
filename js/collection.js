/* 
    © 2021 KondaSoft
    https://www.kondasoft.com
*/

// Handle filtering
const filteringSelectEl = document.getElementById('collection-filtering-select');

if (filteringSelectEl) {
    filteringSelectEl.addEventListener('change', (event) => {
        if ('URLSearchParams' in window) {
            let searchParams = new URLSearchParams(window.location.search);
            if (searchParams.toString()) {
                window.location = event.target.value + '?' + searchParams.toString();
            } else {
                window.location = event.target.value;
            }
        }
    });
}

// Handle sorting
const sortingSelectEl = document.getElementById('collection-sorting-select');

if (sortingSelectEl) {
    sortingSelectEl.addEventListener('change', (event) => {
        if ('URLSearchParams' in window) {
            let searchParams = new URLSearchParams(window.location.search);
            searchParams.set('sort_by', event.target.value);
            window.location.search = searchParams.toString();
        }
    });
}

// Handle layout
const layoutBtnEl = document.getElementById('collection-layout-btn');

if (layoutBtnEl) {
    layoutBtnEl.addEventListener('click', (event) => {
        if ('URLSearchParams' in window) {
            let searchParams = new URLSearchParams(window.location.search);
            searchParams.set('type', event.currentTarget.dataset.value);
            window.location.search = searchParams.toString();
        }
    });
}
