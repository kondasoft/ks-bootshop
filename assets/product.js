/*
  © 2024 KondaSoft
  https://www.kondasoft.com
*/

class ProductForm extends HTMLElement {
  constructor () {
    super()

    this.form = this.querySelector('form')
    this.productOptions = this.form.querySelectorAll('.product-options [name*="option"]')
    this.atcBtn = this.form.querySelector('.btn-atc')
    this.buyBtn = this.form.querySelector('.btn-buy')

    this.form.addEventListener('submit', event => this.onSubmit(event))

    this.productOptions.forEach(elem =>
      elem.addEventListener('change', event => this.onChangeProductOption(event)))

    this.buyBtn?.addEventListener('click', event => this.onClickBuyBtn(event))
  }

  async onChangeProductOption (event) {
    event.preventDefault()

    const selectedOptions = []

    this.productOptions.forEach(elem => {
      if (elem.type === 'radio' && elem.checked) {
        selectedOptions.push(elem.value)
      } else if (elem.type === 'select-one') {
        selectedOptions.push(elem.value)
      }
    })

    // console.log(selectedOptions)

    const selectedVariant = JSON.parse(this.form.dataset.variants).find(variant =>
      JSON.stringify(variant.options) === JSON.stringify(selectedOptions)
    )

    console.log(selectedVariant)

    this.adjustPricing(selectedVariant)
    this.adjustButtons(selectedVariant)

    if (selectedVariant) {
      this.querySelector('[name="id"]').value = selectedVariant.id

      if (this.closest('.product-main')) {
        const url = new URL(window.location)
        url.searchParams.set('variant', selectedVariant.id)
        window.history.replaceState({}, '', url)
      }

      window.dispatchEvent(new CustomEvent('kt.product.variant.change', {
        detail: selectedVariant
      }))
    }
  }

  adjustPricing (selectedVariant) {
    if (!selectedVariant) return

    const comparePrice = this.form.querySelector('.product-price-compare')
    const finalPrice = this.form.querySelector('.product-price-final')
    const compareBadge = this.form.querySelector('.product-sale-badge')
    const soldOutBadge = this.form.querySelector('.product-sold-out-badge')

    if (selectedVariant.compare_at_price > selectedVariant.price) {
      comparePrice.textContent = window.Shopify.formatMoney(selectedVariant.compare_at_price)
      comparePrice.removeAttribute('hidden')
      finalPrice.innerHTML = `<span class="visually-hidden">${window.theme.locales.product.sale_price}}</span>${window.Shopify.formatMoney(selectedVariant.price)}`
      finalPrice.classList.add('product-price-final-sale')
      compareBadge.removeAttribute('hidden')
      if (compareBadge.dataset.discountType === 'percentage') {
        const savings = 100 - (Math.round(selectedVariant.price / selectedVariant.compare_at_price * 100)) + '%'
        compareBadge.textContent = `${window.theme.locales.product.save} ${savings}`
      } else {
        const savings = window.Shopify.formatMoney(selectedVariant.compare_at_price - selectedVariant.price)
        compareBadge.textContent = `${window.theme.locales.product.save} ${savings}`
      }
    } else {
      comparePrice.textContent = ''
      comparePrice.setAttribute('hidden', 'hidden')
      finalPrice.innerHTML = window.Shopify.formatMoney(selectedVariant.price)
      finalPrice.classList.remove('product-price-final-sale')
      compareBadge.textContent = ''
      compareBadge.setAttribute('hidden', 'hidden')
    }

    if (selectedVariant.available) {
      soldOutBadge.setAttribute('hidden', 'hidden')
    } else {
      soldOutBadge.removeAttribute('hidden')
    }
  }

  adjustButtons (selectedVariant) {
    if (selectedVariant) {
      if (selectedVariant.available) {
        this.atcBtn.removeAttribute('disabled')
        this.buyBtn?.removeAttribute('disabled')
        this.atcBtn.innerHTML = window.theme.locales.product.add_to_cart
      } else {
        this.atcBtn.setAttribute('disabled', 'disabled')
        this.buyBtn?.setAttribute('disabled', 'disabled')
        this.atcBtn.innerHTML = window.theme.locales.product.sold_out
      }
    } else {
      this.atcBtn.setAttribute('disabled', 'disabled')
      this.buyBtn?.setAttribute('disabled', 'disabled')
      this.atcBtn.innerHTML = window.theme.locales.product.unavailable
    }
  }

  async onSubmit (event) {
    event.preventDefault()

    this.atcBtn.classList.add('loading')
    this.atcBtn.disabled = true
    this.atcBtn.setAttribute('aria-busy', 'true')

    const formData = new FormData(this.form)

    await document.querySelector('cart-container').add(formData)

    this.atcBtn.classList.remove('loading')
    this.atcBtn.disabled = false
    this.atcBtn.setAttribute('aria-busy', 'false')
  }

  onClickBuyBtn () {
    this.buyBtn.classList.add('loading')
    const variantId = this.form.querySelector('[name="id"]').value
    const qty = Number(this.form.querySelector('input[name="quantity"]')?.value || 1)
    window.location.href = `/cart/${variantId}:${qty}`
  }
}
customElements.define('product-form', ProductForm)

class ProductMediaGallery extends HTMLElement {
  constructor () {
    super()

    const initialSlide = Number(this.dataset.initialSlide)

    /** @type {Swiper} */
    this.thumbs = new window.Swiper(this.querySelector('.swiper-thumbs'), this.thumbsOptions())

    /** @type {Swiper} */
    this.main = new window.Swiper(this.querySelector('.swiper-main'), this.mainOptions())

    this.main.slideTo(initialSlide)

    this.setStickyPosition()
    this.listenVariantChange()
  }

  thumbsOptions () {
    /** @type {SwiperOptions} */
    const options = {
      slidesPerView: Number(this.dataset.thumbsPerView),
      spaceBetween: 10
    }
    return options
  }

  mainOptions () {
    /** @type {SwiperOptions} */
    const options = {
      speed: Number(this.dataset.speed),
      rewind: true,
      pagination: {
        type: 'bullets',
        el: '.swiper-pagination',
        dynamicBullets: true,
        dynamicMainBullets: 2,
        renderFraction: function (currentClass, totalClass) {
          return `<span class="${currentClass}"></span>/<span class="${totalClass}"></span>`
        }
      },
      navigation: {
        nextEl: this.querySelector('.swiper-button-next'),
        prevEl: this.querySelector('.swiper-button-prev')
      },
      thumbs: {
        swiper: this.thumbs,
        autoScrollOffset: 1
      }
    }
    return options
  }

  setStickyPosition () {
    if (this.closest('.product-main') && window.matchMedia('(min-width: 1200px)').matches) {
      const headerGroup = document.querySelector('#header-group.sticky-top')

      let oldScroll = window.scrollY

      window.addEventListener('scroll', () => {
        const newScroll = window.scrollY
        if (newScroll > oldScroll) {
          if (newScroll > headerGroup.clientHeight) {
            this.style.top = '20px'
          }
        } else if (newScroll < oldScroll) {
          this.style.top = `${headerGroup.clientHeight + 20}px`
        }

        oldScroll = Math.max(window.scrollY, 0)
      })
    }
  }

  listenVariantChange () {
    window.addEventListener('kt.product.variant.change', (event) => {
      const selectedVariant = event.detail

      if (selectedVariant.featured_media) {
        this.main.slideTo(selectedVariant.featured_media.position - 1)
      }
    }, false)
  }
}
customElements.define('product-media-gallery', ProductMediaGallery)

// Shopify Subscriptions app
const adjustShopifySubscriptionsStyling = () => {
  document.querySelectorAll('.shopify_subscriptions_app_block [type="radio"]').forEach(radio => {
    radio.classList.add('form-check-input')
  })
}
adjustShopifySubscriptionsStyling()
window.addEventListener('kt.product.quick_view.modal_shown', adjustShopifySubscriptionsStyling)
