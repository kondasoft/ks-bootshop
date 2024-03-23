/*
  © 2024 KondaSoft
  https://www.kondasoft.com
*/

class PredictiveSearch extends HTMLElement {
  constructor () {
    super()

    this.form = this.querySelector('form.search-form')
    this.input = this.form.querySelector('input[type="search"]')
    this.results = this.form.querySelector('#predictive-search')
    this.status = this.form.querySelector('#predictive-search-status')

    this.emptyContainer = this.querySelector('.search-empty')
    this.cartUpsells = this.querySelector('.cart-upsells')

    this.input.addEventListener('input', window.theme.debounce((event) => {
      this.getSearchResults()
    }, 300).bind(this))

    document.querySelector('#offcanvas-search')?.addEventListener('shown.bs.offcanvas', () => {
      this.input.focus()
    })
    this.accessibilityEventIsInit = false
  }

  async getSearchResults () {
    const searchTerm = this.input.value.trim()

    if (searchTerm.length) {
      const response = await fetch(`${window.Shopify.routes.predictive_search_url}?q=${searchTerm}&resources[type]=${this.dataset.resourcesType}&resources[limit]=10&section_id=predictive-search`)

      if (response.ok) {
        const data = await response.text()
        const resultsMarkup = new DOMParser().parseFromString(data, 'text/html').querySelector('#shopify-section-predictive-search').innerHTML

        this.results.innerHTML = resultsMarkup

        this.emptyContainer.setAttribute('hidden', 'hidden')
        this.cartUpsells.setAttribute('hidden', 'hidden')
        this.input.setAttribute('aria-expanded', 'true')
        this.status.textContent = this.querySelector('#predictive-search-results').dataset.resultsText

        this.results.querySelectorAll('.jdgm-prev-badge__stars').forEach(elem => {
          elem.setAttribute('tabindex', '-1')
        })
        this.handleAccessibility()
      } else {
        // TODO: Handle errors
      }
    } else {
      this.emptyContainer.removeAttribute('hidden')
      this.cartUpsells.removeAttribute('hidden')
      this.results.innerHTML = ''
      this.input.setAttribute('aria-expanded', 'false')
      this.input.removeAttribute('aria-activedescendant')
      this.status.textContent = ''
    }
  }

  handleAccessibility () {
    let x = -1

    function listenKeyup (event) {
      const items = this.querySelectorAll('#predictive-search-results a, #predictive-search-results button')

      if (!items.length) return

      if (event.code === 'ArrowUp' || event.code === 'ArrowDown') {
        items.forEach(elem => {
          elem.closest('[role="option"]').setAttribute('aria-selected', 'false')
        })
      }

      switch (event.code) {
      case 'ArrowUp':
        if (x <= 0) {
          x = items.length
        }
        x--
        items.forEach((elem, index) => {
          if (index === x) {
            elem.focus()
            elem.closest('[role="option"]').setAttribute('aria-selected', 'true')
            this.input.setAttribute('aria-activedescendant', elem.closest('[role="option"]').getAttribute('id'))
          }
        })
        break
      case 'ArrowDown':
        if (x === items.length - 1) {
          x = -1
        }
        x++
        items.forEach((elem, index) => {
          if (index === x) {
            elem.focus()
            elem.closest('[role="option"]').setAttribute('aria-selected', 'true')
            this.input.setAttribute('aria-activedescendant', elem.closest('[role="option"]').getAttribute('id'))
          }
        })
        break
      case 'Enter':
        console.log('Enter')
        break
      }
    }

    if (!this.accessibilityEventIsInit) {
      this.addEventListener('keyup', listenKeyup)
      this.accessibilityEventIsInit = true
    }
  }
}

customElements.define('predictive-search', PredictiveSearch)
