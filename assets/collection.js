/*
    © 2022 KondaSoft.com
    https://www.kondasoft.com
*/

// Load collection elements dynamically (after ajax change)
const loadCollection = async () => {
    const productList = document.querySelector('.collection .product-list')

    if (productList) {
        productList.style.opacity = '.2'
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })

    const response = await fetch(window.location.href)
    const data = await response.text()
    const parser = new DOMParser()
    const newDocument = parser.parseFromString(data, 'text/html')

    document.querySelector('.collection')
        ?.replaceWith(newDocument.querySelector('.collection'))

    document.querySelectorAll('#offcanvas-filters .collapse-inner').forEach((collapse) => {
        const collapseId = collapse.closest('.collapse').getAttribute('id')
        collapse.replaceWith(newDocument.querySelector(`#offcanvas-filters #${collapseId} .collapse-inner`))
    })

    document.querySelector('#offcanvas-filters .offcanvas-footer')
        ?.replaceWith(newDocument.querySelector('#offcanvas-filters .offcanvas-footer'))

    document.querySelector('#offcanvas-filters .btn-filters-clear-all')
        ?.replaceWith(newDocument.querySelector('#offcanvas-filters .btn-filters-clear-all'))

    document.querySelector('#offcanvas-filters [name="sort_by"]')
        ?.replaceWith(newDocument.querySelector('#offcanvas-filters [name="sort_by"]'))

    const customEvent = new CustomEvent('updated.ks.collection')
    window.dispatchEvent(customEvent)
}

// Handle collection filters change events
window.onChangeCollectionFilter = async (input, event) => {
    const form = input.closest('form')
    const params = new URLSearchParams(new FormData(form))
    const url = `${window.location.pathname}?${params.toString()}`
    window.history.replaceState({}, '', url)

    await loadCollection()
}

// Handle collection price filters change
const initCollectionFiltersPriceChange = () => {
    document.querySelectorAll('.filter-price-group input').forEach(input => {
        input.addEventListener('input', window.debounce(async (event) => {
            const form = input.closest('form')
            const params = new URLSearchParams(new FormData(form))
            const url = `${window.location.pathname}?${params.toString()}`
            window.history.replaceState({}, '', url)

            await loadCollection()
        }, 750))
    })
}
initCollectionFiltersPriceChange()
window.addEventListener('updated.ks.collection', initCollectionFiltersPriceChange)

// 'View more' within collection filters
window.onClickFiltersViewMore = (btn, event) => {
    btn.closest('.collapse').querySelectorAll('.form-check').forEach((elem) => {
        elem.removeAttribute('hidden')
    })

    btn.remove()
}

// 'Clear all' within collection filters
window.onClickClearAllFilters = async (btn, event) => {
    const form = btn.closest('form')
    const params = new URLSearchParams()
    params.set('sort_by', form.querySelector('[name="sort_by"]').value)
    const url = `${window.location.pathname}?${params.toString()}`
    window.history.replaceState({}, '', url)

    await loadCollection()
}

// Sort-by select change event
window.onChangeCollectionSortBy = (value) => {
    const params = new URLSearchParams(window.location.search)
    params.set('sort_by', value)
    const url = `${window.location.pathname}?${params.toString()}`
    window.history.replaceState({}, '', url)

    loadCollection()
}
