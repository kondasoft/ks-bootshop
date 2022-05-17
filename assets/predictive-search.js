/*
    © 2022 KondaSoft.com
    https://www.kondasoft.com
*/

class PredictiveSearch extends HTMLElement {
    constructor () {
        super()

        this.input = this.querySelector('input[type="search"]')
        this.predictiveSearchResults = this.querySelector('#predictive-search')

        this.input.addEventListener('input', this.debounce((event) => {
            this.onChange(event)
        }, 300).bind(this))

        document.querySelector('#offcanvas-search')?.addEventListener('shown.bs.offcanvas', () => {
            this.input.focus()
        })
    }

    onChange () {
        const searchTerm = this.input.value.trim()

        console.log(searchTerm)

        if (!searchTerm.length) {
            this.close()
            return
        }

        this.getSearchResults(searchTerm)
    }

    async getSearchResults (searchTerm) {
        const response = await fetch(`/search/suggest?q=${searchTerm}&resources[type]=product&resources[limit]=10&section_id=predictive-search`)

        if (!response.ok) {
            const error = new Error(response.status)
            this.close()
            throw error
        }

        const text = await response.text()
        const resultsMarkup = new DOMParser().parseFromString(text, 'text/html').querySelector('#shopify-section-predictive-search').innerHTML
        this.predictiveSearchResults.innerHTML = resultsMarkup
        this.open()
    }

    open () {
        this.predictiveSearchResults.style.display = 'block'
    }

    close () {
        this.predictiveSearchResults.style.display = 'none'
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
