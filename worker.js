var fs = require('fs')
var diff = require('virtual-dom/diff')
var shaved = require('shave-template')

module.exports = function (self) {

  var state = { 'clicks': 0, 'url': '/site.html' }

  var site  = shaved(fs.readFileSync('./site.html', 'utf8')) // html string to vdom
  var other = shaved(fs.readFileSync('./other.html', 'utf8'))

  var sitedom = shaved.vdom(rootnode)
  var newdom = site

  self.onmessage = function (msg) {
    console.log(msg)
    updateObj(state, msg)
    render()
  }

}

function render () {
  newdom = app(state)
  var patches = diff(sitedom, newdom)
  sitedom = newdom
  paint({
    'url': state.url,
    'patches': patches
  })
}

function app (state) {
  var tdom, pagevars = {}
  if ( '/site.html' === state.url ) {
    tdom = site
    pagevars = {'title': 'yes', '#count': state.clicks, 'button': {onclick: onclick, _html: 'hey'}}
    function onclick () {
      state.clicks += 1
      render()
    }
  }
  else if ( '/other.html' === state.url ) {
    tdom = other
    pagevars = {'title': 'hey', '#msg': 'there you go'}
  }
  else { // home
    pagevars = {'title': 'home', '#msg': 'home sweet home'}
  }
  return shaved(tdom, pagevars)
}

function updateObj (targetObject, obj) {
  Object.keys(obj).forEach(function (key) {
    if ( undefined === obj[key] || null === obj[key] ) {
      delete targetObject[key]
    }
    else if ( 
        'object' === typeof obj[key] && !Array.isArray(obj[key]) 
    ) {
      if ( 
        !('object' === typeof targetObject[key] && !Array.isArray(targetObject[key])) 
      ) {
        targetObject[key] = {}
      }
      update(targetObject[key], obj[key])
    }
    else {
      targetObject[key] = obj[key]
    }
  })
}
