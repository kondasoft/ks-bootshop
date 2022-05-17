/*
    © 2022 KondaSoft.com
    https://www.kondasoft.com
*/

// Load collection elements dynamically (after filters change)
const loadCollection = async (url) => {
    const productList = document.querySelector('.collection .product-list')

    if (productList) {
        productList.style.opacity = '.2'
    }

    const response = await fetch(url)
    const data = await response.text()
    const parser = new DOMParser()
    const newDocument = parser.parseFromString(data, 'text/html')

    document.querySelectorAll('#offcanvas-filters .collapse-inner').forEach((collapse) => {
        const collapseId = collapse.closest('.collapse').getAttribute('id')
        collapse.replaceWith(newDocument.querySelector(`#offcanvas-filters #${collapseId} .collapse-inner`))
    })
    document.querySelector('#offcanvas-filters .offcanvas-footer')
        ?.replaceWith(newDocument.querySelector('#offcanvas-filters .offcanvas-footer'))
    document.querySelector('.collection')
        ?.replaceWith(newDocument.querySelector('.collection'))

    window.history.replaceState({}, '', url)

    const customEvent = new CustomEvent('ks.collection.loaded')
    window.dispatchEvent(customEvent)
}

// Handle collection filters change events
window.onChangeCollectionFilter = async (input, event) => {
    const form = input.closest('form')
    const params = new URLSearchParams(new FormData(form))
    const url = `${window.location.pathname}?${params.toString()}`

    await loadCollection(url)

    window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Remove active filters via ajax
window.removeActiveCollectionFilter = async (btn, event) => {
    const url = btn.dataset.url

    await loadCollection(url)
}

// Sort-by select change event
window.onChangeSortBy = (value) => {
    const params = new URLSearchParams(window.location.search)
    params.set('sort_by', value)
    const url = `${window.location.pathname}?${params.toString()}`

    loadCollection(url)
}

// Inifinite Pagination
window.onClickCollectionPagination = async (link, event) => {
    event.preventDefault()

    link.style.width = `${link.offsetWidth}px`
    link.style.height = `${link.offsetHeight}px`
    link.innerHTML = `
        <div class="spinner-border spinner-border-sm mx-auto" role="status" style="width: 1.2rem; height: 1.2rem">
            <span class="visually-hidden">Loading...</span>
        </div>
    `

    const respoonse = await fetch(link.getAttribute('href'))
    const data = await respoonse.text()
    const parser = new DOMParser()
    const newDocument = parser.parseFromString(data, 'text/html')

    document.querySelector('.collection .product-list')
        .insertAdjacentHTML('beforeend', newDocument.querySelector('.collection .product-list').innerHTML)

    document.querySelector('#collection-pagination')
        .replaceWith(newDocument.querySelector('#collection-pagination'))

    const customEvent = new CustomEvent('ks.collection.paginated')
    link.dispatchEvent(customEvent)
}
