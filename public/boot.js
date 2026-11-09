// Runs before anything else. When the opening film will play (any visit that is not a reload),
// start downloading its 3D scene immediately instead of waiting for the rest of the site.
;(function () {
  var nav = performance.getEntriesByType && performance.getEntriesByType('navigation')[0]
  var intro = !nav || (nav.type !== 'reload' && nav.type !== 'back_forward')
  var root = document.documentElement
  if (!intro) {
    root.className += ' no-intro'
    return
  }
  var src = document.currentScript && document.currentScript.getAttribute('data-intro')
  if (src) {
    var l = document.createElement('link')
    l.rel = 'modulepreload'
    l.href = src
    l.crossOrigin = ''
    document.head.appendChild(l)
  }
})()
