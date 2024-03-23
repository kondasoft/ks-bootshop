/*
  © 2024 KondaSoft
  https://www.kondasoft.com
*/

class Cart extends HTMLElement {
  constructor () {
    super()

    this.querySelectorAll('[name="updates[]"]').forEach(input =>
      input.addEventListener('change', () =>
        this.change(input.dataset.lineItemKey, Number(input.value))
      )
    )

    this.querySelectorAll('.btn-line-item-remove').forEach(btn =>
      btn.addEventListener('click', () =>
        this.change(btn.dataset.lineItemKey, 0)
      )
    )

    this.showOffcanvasIfUrl()
    this.adjustCollapses()
  }

  async add (formData) {
    formData.append('sections', ['cart-count-badge', 'offcanvas-cart'])
    formData.append('sections_url', window.location.pathname)

    const response = await fetch(`${window.Shopify.routes.cart_add_url}.js`, {
      method: 'POST',
      body: formData
    })
    console.log(response)
    const data = await response.json()
    console.log(data)

    if (response.ok) {
      window.dispatchEvent(new CustomEvent('kt.cart.added', { detail: data }))
      this.reloadCartElements(data.sections)
    } else {
      this.showError(data.description)
    }

    document.querySelectorAll('.offcanvas').forEach(offcanvas => {
      if (offcanvas.id === 'offcanvas-cart') {
        window.bootstrap.Offcanvas.getOrCreateInstance(offcanvas).show()
      } else {
        window.bootstrap.Offcanvas.getOrCreateInstance(offcanvas).hide()
      }
    })
  }

  async change (id, quantity) {
    this.classList.add('loading')

    const response = await fetch(`${window.Shopify.routes.cart_change_url}.js`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        quantity,
        sections: ['cart-count-badge', 'offcanvas-cart'],
        sections_url: window.location.pathname
      })
    })
    console.log(response)
    const data = await response.json()
    console.log(data)

    if (response.ok) {
      window.dispatchEvent(new CustomEvent('kt.cart.changed', { detail: data }))
      this.reloadCartElements(data.sections)
    } else {
      this.showError(data.description)
    }

    this.classList.remove('loading')
  }

  reloadCartElements (sections) {
    for (const [key, value] of Object.entries(sections)) {
      const newDoc = new DOMParser().parseFromString(value, 'text/html')

      switch (key) {
      case 'cart-count-badge':
        document.querySelectorAll('.cart-count-badge').forEach(elem => {
          const newDoc = new DOMParser().parseFromString(value, 'text/html')
          elem.replaceWith(newDoc.querySelector('.cart-count-badge'))
        })
        break
      case 'offcanvas-cart':
        this.replaceWith(newDoc.querySelector('cart-container'))
        break
      }
    }

    window.dispatchEvent(new CustomEvent('kt.cart.reloaded'))
  }

  showError (message) {
    const alert = this.querySelector('.alert')

    if (alert) {
      alert.querySelector('[data-alert-msg]').innerHTML = message
      alert.removeAttribute('hidden')
    }
  }

  showOffcanvasIfUrl () {
    if (new URLSearchParams(window.location.search).has('cart')) {
      const offcanvas = document.querySelector('#offcanvas-cart')

      if (offcanvas) {
        window.bootstrap.Offcanvas.getOrCreateInstance(offcanvas).show()
      }
    }
  }

  adjustCollapses () {
    this.querySelectorAll('[data-bs-toggle="collapse"]').forEach(elem => {
      elem.addEventListener('click', () => {
        setTimeout(() => {
          const offcanvasBody = this.querySelector('.offcanvas-body')
          offcanvasBody.scroll({ top: offcanvasBody.scrollHeight, behavior: 'smooth' })
        }, 250)
      })
    })
  }
}
customElements.define('cart-container', Cart)

class CartNote extends HTMLElement {
  constructor () {
    super()

    this.input = this.querySelector('textarea')
    this.btn = this.querySelector('button')
    this.btn.addEventListener('click', this.onSubmit.bind(this))
  }

  async onSubmit () {
    this.btn.classList.add('loading')

    await fetch(`${window.Shopify.routes.cart_update_url}.js`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note: this.input.value })
    })

    this.btn.innerHTML = `✓ <span class="visually-hidden">${this.btn.dataset.textNoteSaved}</span>`

    setTimeout(() => {
      this.btn.innerHTML = this.btn.dataset.textBtnSave
    }, 3000)

    this.btn.classList.remove('loading')
  }
}
customElements.define('cart-note', CartNote)
