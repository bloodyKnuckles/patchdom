var router = require('routes')()
var XHR = require('xhr-promise-bare')

var state = { 'clicks': 0, 'url': '/' }


router.addRoute('*', function (data, routermatch) {
  return XHR('test.json')
  /*
  .then(function (response) {
    var pp = Promise.defer()
    setTimeout(function () {
      pp.resolve(response)
    }, 2000)
    return pp.promise
  }) //*/
  .then(JSON.parse)
  .then(function (testJSON) {
    //console.log(testJSON.test)
    if ( 'url' === data.cmd ) {
      state.url = data.url
    }
    console.log('all routes', data)
    var rm = routermatch.next(data)
    return rm.fn(data, rm)
  })
})

router.addRoute("/(index\.html)?", function (data, routermatch) {
  return XHR('test.json')
  .then(JSON.parse)
  .then(function (testJSON) {
    //console.log(testJSON.test + ' hey')
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
})

router.addRoute("/other(\.html)?", function (data, routermatch) {
  return Promise.resolve({
    templates: ['/other.html', '/template.html'],
    content: {'#msg': 'This is the other page message.', '#wat': 'yup'}
  })
})

module.exports = router
