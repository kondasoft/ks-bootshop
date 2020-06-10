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
      img.src = img.dataset.src;
    })
  } else {
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.2.2/lazysizes.min.js'
    document.body.appendChild(script)
  }

  // Add to cart with Ajax
  $('form[action="/cart/add"]').submit(function(e) {
    e.preventDefault()
    let addToCartBtn = $(this).find('.add-to-cart-btn')

    addToCartBtn.prop("disabled", true).fadeTo(200, 0.5)
    addToCartBtn.find('.bs-spinner').removeClass('d-none')
    addToCartBtn.find('span').html(addToCartBtn.attr('data-loading-text'))

    jQuery.post('/cart/add.js', $(this).serialize(), function(addToCartData) {
      console.log(addToCartData)

      jQuery.getJSON('/cart.js', function(cartData) {
        console.log(cartData)
        addToCartBtn.prop("disabled", false).fadeTo(200, 1)
        addToCartBtn.find('.bs-spinner').addClass('d-none')
        addToCartBtn.find('span').html(addToCartBtn.attr('data-add-to-cart-text'))

        $('.modal').modal('hide')
      })

    }, 'json')
  })

})

// Product image gallery - select current image
function selectCurrentGalleryImage(el) {
  el.closest('.product-image-gallery').find('.active')
    .removeClass('active')
    .removeAttr('aria-current')

  el.closest('.product-image-gallery').find('.img-thumbnail')
    .removeClass('border-secondary')

  el.addClass('active').attr('aria-current', 'true')
  el.children('.img-thumbnail').addClass('border-secondary')

  el.closest('.modal-body').find('img.product-featured-image')
    .attr('src', el.attr('data-featured-img'))
    .attr('alt', el.find('img').attr('alt'))
}
