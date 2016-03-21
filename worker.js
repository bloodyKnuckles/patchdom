var fs = require('fs')
var diff = require('virtual-dom/diff')
var shaved = require('shave-template')
var editObj = require('edit-object')
var serializePatch = require('vdom-serialized-patch/serialize')
var fromJSON = require('vdom-as-json/fromJson')

module.exports = function (self) {

  var state = { 'clicks': 0, 'url': '/site.html' }

  var site  = shaved(fs.readFileSync('./site.html', 'utf8')) // html string to vdom
  var other = shaved(fs.readFileSync('./other.html', 'utf8'))

  var newdom = site
  //var sitedom = newdom

  self.onmessage = function (msg) {
    editObj(state, msg.data)
    render()
  }

  function render () {
    newdom = app(state)
    var patches = diff(fromJSON(state.sitedom), newdom)
    //var patches = diff(sitedom, newdom)
    state.sitedom = newdom
    self.postMessage({'url': state.url, 'patches': serializePatch(patches)})
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
}
