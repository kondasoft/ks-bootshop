$(function() {

  // Detect that Javascript is enabled
  $("html").removeClass("no-js").addClass('js')


  // Detect that Cookies are enabled
  if (navigator.cookieEnabled) {
    $(".supports-cookies").removeClass("d-none")
    $(".supports-no-cookies").addClass("d-none")
  }


  // Initialize Bootstrap Tooltips
  $('[data-toggle="tooltip"]').tooltip()


  // Lazyload images
  if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]')
    images.forEach(img => {
      img.src = img.dataset.src
    })
  } else {
    // Browser does not support "loeading" attribute. Use fallback alternative
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.2.2/lazysizes.min.js'
    document.body.appendChild(script)
  }

  // Add to cart with Ajax
  $('form[action="/cart/add"]').submit(function(e) {
    e.preventDefault()
    let quantity =  parseInt($(this).find('input[type=number]').val())
    let addToCartBtn = $(this).find('.add-to-cart-btn')
    let cartIconEl = $('#cart-icon-count')
    let toast = $('#cart-toast')

    // Update cart button to indicate loading
    addToCartBtn.prop("disabled", true).fadeTo(200, 0.5)
    addToCartBtn.find('.bs-spinner').removeClass('d-none')
    addToCartBtn.find('span').html(addToCartBtn.attr('data-loading-text'))

    jQuery.post('/cart/add.js', $(this).serialize(), function(data) {
      console.log(data)

      let price = data.final_price
      let image_src = Shopify.resizeImage(data.featured_image.url, '120x120')
      let image_alt = data.featured_image.alt

      // Update cart button back to normal state
      addToCartBtn.prop("disabled", false).fadeTo(200, 1)
      addToCartBtn.find('.bs-spinner').addClass('d-none')
      addToCartBtn.find('span').html(addToCartBtn.attr('data-add-to-cart-text'))

      // Close quick view modal if its open
      $('.modal').modal('hide')

      // Update cart icon on header
      cartIconEl.closest('#cart-icon').addClass('text-primary')
      cartIconEl.text(parseInt(cartIconEl.text()) + quantity)

      // Display Bootstrap toast component with the new item added to cart
      toast.toast('dispose').toast('show').find('.toast-body')
        .html(`
          <div class="d-flex align-items-center mb-0">
            <img class="img-thumbnail mr-2" src="${image_src}" alt="${image_alt}" width="60" height="60" style="object-fit: cover">
            <p class="mb-0">
              <span class="d-block mb-0">${data.title}</span>
              <span class="text-muted">${quantity} x ${ Shopify.formatMoney(price, "")}</span>
            </p>
          </div>
          <hr>
          <a href="/cart" class="btn btn-primary btn-block btn-sm">${addToCartBtn.attr('data-view-cart-text')}</a>
        `)

      toast.focus()

    }, 'json')
    .fail(function(error) {
      console.log(error)
      
      const response = error.responseJSON

      // Update cart button back to normal state
      addToCartBtn.prop("disabled", false).fadeTo(200, 1)
      addToCartBtn.find('.bs-spinner').addClass('d-none')
      addToCartBtn.find('span').html(addToCartBtn.attr('data-add-to-cart-text'))
      
      // Display Bootstrap toast component as error
      toast.find('.toast-header strong').html(`${response.status} - ${response.message}`)

      toast.toast('dispose').toast('show').find('.toast-body')
        .html(`
          <div>
            <p class="mb-0">
              ${response.description}
            </p>
          </div>
        `)

    })
  })

})

// Handle Product image gallery
function handleProductImageGallery(el) {
  el.closest('.product-image-gallery')
    .find('.active')
    .removeClass('active')
    .removeAttr('aria-current')
    .find('.img-thumbnail')
    .removeClass('border-secondary')

  el.addClass('active').attr('aria-current', 'true')
  el.children('.img-thumbnail').addClass('border-secondary')

  el.closest('.product-images').find('img.product-featured-image')
    .attr('src', el.attr('data-featured-img'))
    .attr('alt', el.find('img').attr('alt'))
}
