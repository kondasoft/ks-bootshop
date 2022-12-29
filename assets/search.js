/*
    © 2022 KondaSoft.com
    https://www.kondasoft.com
*/

class PredictiveSearch extends HTMLElement {
    constructor () {
        super()

        this.input = this.querySelector('input[type="search"]')
        this.results = this.querySelector('#predictive-search')
        this.alert = this.querySelector('#predictive-search-alert')
        this.footer = this.closest('#offcanvas-search').querySelector('.offcanvas-footer')
        this.popularProducts = this.closest('#offcanvas-search').querySelector('#search-popular-products-wrapper')

        this.input.addEventListener('input', this.debounce((event) => {
            this.onChange(event)
        }, 300).bind(this))

        document.querySelector('#offcanvas-search')?.addEventListener('shown.bs.offcanvas', () => {
            this.input.focus()
        })
    }

    onChange () {
        const searchTerm = this.input.value.trim()
        // console.log(searchTerm)

        this.footer.querySelector('[name="q"]').value = searchTerm
        this.footer.querySelector('.btn').textContent =
            `${this.footer.querySelector('.btn').dataset.textSearchFor} "${searchTerm}"`

        if (!searchTerm.length) {
            this.close()
            return
        }

        this.getSearchResults(searchTerm)
    }

    async getSearchResults (searchTerm) {
        let resourcesType = 'product'

        if (this.input.dataset.searchCollections === 'true') {
            resourcesType = `${resourcesType},collection`
        }
        if (this.input.dataset.searchPages === 'true') {
            resourcesType = `${resourcesType},page`
        }
        if (this.input.dataset.searchArticles === 'true') {
            resourcesType = `${resourcesType},article`
        }

        const response = await fetch(`/search/suggest?q=${searchTerm}&resources[type]=${resourcesType}&resources[limit]=10&section_id=predictive-search`)

        if (!response.ok) {
            const error = new Error(response.status)
            this.close()
            throw error
        }

        const text = await response.text()
        const resultsMarkup = new DOMParser().parseFromString(text, 'text/html').querySelector('#shopify-section-predictive-search').innerHTML
        this.results.innerHTML = resultsMarkup

        this.open()
    }

    open () {
        this.results.style.display = 'block'

        const countResults = this.results.querySelectorAll('.product-item').length

        switch (countResults) {
        case 0:
            this.alert.textContent = this.alert.dataset.textNoResults
            break
        case 1:
            this.alert.textContent = this.alert.dataset.textResultFound
            break
        default:
            this.alert.textContent = this.alert.dataset.textResultsFound.replace('[count]', countResults)
            break
        }

        this.footer.removeAttribute('hidden')

        window.SPR?.initDomEls()
        window.SPR?.loadBadges()

        document.querySelectorAll('#offcanvas-search .btn-atc').forEach(btn => {
            btn.addEventListener('click', () => {
                setTimeout(() => {
                    bootstrap.Offcanvas.getOrCreateInstance('#offcanvas-search').hide()
                }, 300)
            })
        })

        this.popularProducts?.setAttribute('hidden', 'hidden')
    }

    close () {
        this.results.style.display = 'none'
        this.alert.textContent = ''
        this.footer.setAttribute('hidden', 'hidden')

        this.popularProducts?.removeAttribute('hidden')
    }

    debounce (fn, wait) {
        let t
        return (...args) => {
            clearTimeout(t)
            t = setTimeout(() => fn.apply(this, args), wait)
        }
    }
}

customElements.define('predictive-search', PredictiveSearch)
