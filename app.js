var router = require('routes')()

var state = { 'clicks': 0, 'url': '/' }


router.addRoute('*', function (data, routermatch) {
  if ( 'url' === data.cmd ) {
    state.url = data.url
  }
  console.log('all routes')
  var rm = routermatch.next(data)
  return rm.fn(data, rm)

})

router.addRoute("/(index.html)?", function (data, routermatch) {
  if ( 'inc' ===  data.cmd ) {
    state.clicks += 1
  }
  return Promise.resolve({
    templates: '/index.html', // work in array option for layered templates
    content: {'title': 'yes', '#count': state.clicks, 'button': {onclick: onclick, _html: 'hey'}}
  })
  function onclick (evt) {
    console.log('clicked')
    evt.preventDefault()
    window.worker.postMessage({cmd: 'inc', url: '/'})
  }
})

module.exports = router
