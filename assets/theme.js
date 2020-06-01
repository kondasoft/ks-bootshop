$(function() {

  // Detect that Javascript is enabled
  $("html").removeClass("no-js")

  // Detect that Cookies are enabled
  if (navigator.cookieEnabled)
    $("html").removeClass("supports-no-cookies")

  // Initialize Bootstrap Tooltips
  $('[data-toggle="tooltip"]').tooltip()

})
