/*
  © 2024 KondaSoft
  https://www.kondasoft.com
*/

console.log('KS BootShop - Free Shopify Theme by KondaSoft.com | Learn more at https://www.kondasoft.com')

// Init Bootstrap tooltips
document.querySelectorAll('[data-bs-toggle="tooltip"]')
  .forEach((el) => new window.bootstrap.Tooltip(el))

// Init Bootstrap popovers
document.querySelectorAll('[data-bs-toggle="popover"]')
  .forEach((el) => new window.bootstrap.Popover(el))

// Debouce
window.theme.debounce = function (callback, wait = 200) {
  let timeout
  return (...args) => {
    const context = this
    clearTimeout(timeout)
    timeout = setTimeout(() => callback.apply(context, args), wait)
  }
}

// Throttle
window.theme.throttle = function (callback, timeFrame = 200) {
  let lastTime = 0
  return function () {
    const now = Date.now()
    if (now - lastTime >= timeFrame) {
      callback()
      lastTime = now
    }
  }
}

// Create cookie
window.theme.createCookie = function (name, value, days) {
  let date, expires
  if (days) {
    date = new Date()
    date.setDate(date.getDate() + days)
    expires = '; expires=' + date.toUTCString()
  } else {
    expires = ''
  }
  document.cookie = name + '=' + value + expires + '; path=/'
}

// Detect scroll
window.addEventListener('scroll', () => {
  if (window.scrollY > 0) {
    document.documentElement.classList.add('has-scrolled')
  } else {
    document.documentElement.classList.remove('has-scrolled')
  }
})

// Calculate "xx time ago"
window.theme.calcTimeAgo = function (timestamp) {
  const now = new Date().getTime()
  const diff = now - timestamp

  let text

  if (diff < 60000) {
    text = window.theme.locales.times.moments
  } else if (diff < 3.6e+6) {
    const min = Math.round((diff) / 60000)
    text = min === 1
      ? `${min} ${window.theme.locales.times.minute}`
      : `${min} ${window.theme.locales.times.minutes}`
  } else if (diff < 8.64e+7) {
    const hours = Math.round((diff) / 3.6e+6)
    text = hours === 1
      ? `${hours} ${window.theme.locales.times.hour}`
      : `${hours} ${window.theme.locales.times.hours}`
  } else {
    const days = Math.round((diff) / 8.64e+7)
    text = days === 1
      ? `${days} ${window.theme.locales.times.day}`
      : `${days} ${window.theme.locales.times.days}`
  }

  return `${text} ${window.theme.locales.times.ago}`
}

// Format money
window.Shopify.formatMoney = function (cents, moneyFormat = window.Shopify.moneyFormat) {
  if (typeof cents === 'string') {
    cents = cents.replace('.', '')
  }

  let value = ''
  const placeholderRegex = /\{\{\s*(\w+)\s*\}\}/

  function defaultOption (opt, def) {
    return (typeof opt === 'undefined' ? def : opt)
  }

  function formatWithDelimiters (number, precision, thousands, decimal) {
    precision = defaultOption(precision, 2)
    thousands = defaultOption(thousands, ',')
    decimal = defaultOption(decimal, '.')

    if (isNaN(number) || number == null) {
      return 0
    }

    number = (number / 100.0).toFixed(precision)

    const parts = number.split('.')
    const dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands)
    const cents = parts[1] ? (decimal + parts[1]) : ''

    return dollars + cents
  }

  switch (moneyFormat.match(placeholderRegex)[1]) {
  case 'amount':
    value = formatWithDelimiters(cents, 2)
    break
  case 'amount_no_decimals':
    value = formatWithDelimiters(cents, 0)
    break
  case 'amount_with_comma_separator':
    value = formatWithDelimiters(cents, 2, '.', ',')
    break
  case 'amount_no_decimals_with_comma_separator':
    value = formatWithDelimiters(cents, 0, '.', ',')
    break
  }

  return moneyFormat.replace(placeholderRegex, value)
}

// Resize images
window.Shopify.resizeImage = function (src, size, crop = '') {
  return src.replace(/_(pico|icon|thumb|small|compact|medium|large|grande|original|1024x1024|2048x2048|master)+\./g, '.')
    .replace(/\.jpg|\.png|\.gif|\.jpeg/g, (match) => {
      if (crop.length) {
        crop = `_crop_${crop}`
      }
      return `_${size}${crop}${match}`
    })
}

// Shopify's callenge page
document.querySelector('.btn.shopify-challenge__button')
  ?.classList.add('btn-primary')

// Shopify's errors messages
const errors = document.querySelector('.errors')
if (errors) {
  errors.classList.add('alert', 'alert-danger')
}

// Wrap Shopify's section apps within a container
document.querySelectorAll('.shopify-section > .shopify-app-block').forEach(elem => {
  elem.classList.add('container')
})

// Detect viewport with the Intersection Observer API
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('viewport-entered')
    } else {
      entry.target.classList.remove('viewport-entered')
    }
  })
}, { threshold: 0.4 })

document.querySelectorAll('.viewport-detect').forEach((el) => {
  observer.observe(el)
})

// Swiper Slider
class SwiperSlider extends HTMLElement {
  constructor () {
    super()

    this.init()

    document.addEventListener('shopify:section:load', (event) => {
      if (event.detail.sectionId === this.dataset.sectionId) {
        this.init()
      }
    })
  }

  init () {
    this.slider = new window.Swiper(this.querySelector('.swiper'), {
      speed: this.speed,
      autoplay: this.autoplay,
      navigation: this.navigation,
      pagination: this.pagination,
      scrollbar: this.scrollbar,
      breakpoints: this.breakpoints,
      rewind: true
    })
  }

  speed = Number(this.dataset.sliderSpeed)

  autoplay = this.dataset.sliderAutoplay === '0'
    ? undefined
    : { delay: Number(this.dataset.sliderAutoplay) * 1000 }

  navigation = {
    enabled: this.dataset.sliderNavigation === 'true',
    prevEl: '.swiper-button-prev',
    nextEl: '.swiper-button-next'
  }

  pagination = {
    enabled: this.dataset.sliderPagination === 'true',
    el: '.swiper-pagination',
    type: 'bullets',
    dynamicBullets: true,
    dynamicMainBullets: 2,
    renderFraction: function (currentClass, totalClass) {
      return `<span class="${currentClass}"></span>/<span class="${totalClass}"></span>`
    }
  }

  scrollbar = {
    enabled: this.dataset.sliderScrollbar === 'true',
    el: this.querySelector('.swiper-scrollbar'),
    draggable: true
  }

  breakpoints = {
    0: { slidesPerView: Number(this.dataset.breakpointMobile) },
    600: { slidesPerView: Number(this.dataset.breakpointTablet) },
    1200: { slidesPerView: Number(this.dataset.breakpointDesktop) }
  }
}
customElements.define('swiper-slider', SwiperSlider)

/*
  Localization form
*/
document.querySelectorAll('.shopify-localization-form button').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('form').querySelector('[name="country_code"]').value = btn.dataset.isoCode
    btn.closest('form').submit()
  })
})
