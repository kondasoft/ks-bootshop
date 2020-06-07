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

})
