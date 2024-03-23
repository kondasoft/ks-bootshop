/*
  © 2024 KondaSoft
  https://www.kondasoft.com
*/

const loadCollection = async () => {
  const collectionProducts = document.querySelector('.collection-products')
  const productList = collectionProducts.querySelector('.product-list')
  const filters = document.querySelector('.collection-filters')

  if (productList) {
    productList.style.opacity = '.2'
  }

  const response = await fetch(window.location.href)
  const data = await response.text()
  const parser = new DOMParser()
  const newDocument = parser.parseFromString(data, 'text/html')

  collectionProducts?.replaceWith(newDocument.querySelector('.collection-products'))
  filters?.replaceWith(newDocument.querySelector('.collection-filters'))

  window.dispatchEvent(new CustomEvent('kt.collection.loaded'))

  const newCollectionProducts = document.querySelector('.collection-products')
  const navbarHeight = document.querySelector('[id*="__navbar"].sticky-top')?.clientHeight || 0
  newCollectionProducts.style.scrollMarginTop = `${navbarHeight}px`
  newCollectionProducts.scrollIntoView()
}

class CollectionFilters extends HTMLElement {
  constructor () {
    super()

    this.form = this.querySelector('form')

    this.form.querySelectorAll('input').forEach(input => {
      input.addEventListener('change', () => {
        const params = new URLSearchParams(new FormData(this.form))
        const url = `${window.location.pathname}?${params.toString()}`
        window.history.replaceState({}, '', url)

        loadCollection()
      })
    })

    this.querySelectorAll('.btn-filters-clear-all').forEach(btn => {
      const params = new URLSearchParams(window.location.search)

      for (const key of params.keys()) {
        if (key.includes('filter.')) {
          btn.removeAttribute('hidden')
        }
      }

      btn.addEventListener('click', () => {
        for (const key of [...params.keys()]) {
          if (key.includes('filter.')) {
            params.delete(key)
          }
        }

        const url = `${window.location.pathname}?${params.toString()}`
        window.history.replaceState({}, '', url)
        loadCollection()
      })
    })
  }
}
customElements.define('collection-filters', CollectionFilters)

class SortBy extends HTMLElement {
  constructor () {
    super()

    this.querySelectorAll('input').forEach(input => {
      input.addEventListener('change', () => {
        this.setUrl(input.value)
        loadCollection()
      })
    })
  }

  setUrl (value) {
    const params = new URLSearchParams(window.location.search)
    params.set('sort_by', value)
    params.delete('page')
    const url = `${window.location.pathname}?${params.toString()}`
    window.history.replaceState({}, '', url)
  }
}
customElements.define('sort-by', SortBy)

class Pagination extends HTMLElement {
  constructor () {
    super()

    this.querySelectorAll('a').forEach(elem => {
      elem.addEventListener('click', (event) => {
        event.preventDefault()

        this.setUrl(elem.dataset.newPage)
        loadCollection()
      })
    })
  }

  setUrl (value) {
    const params = new URLSearchParams(window.location.search)
    params.set('page', value)
    const url = `${window.location.pathname}?${params.toString()}`
    window.history.replaceState({}, '', url)
  }
}
customElements.define('collection-pagination', Pagination)
