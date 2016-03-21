var fs = require('fs')
var diff = require('virtual-dom/diff')
//var shaved = require('shave-template')
var editObj = require('edit-object')
//var serializePatch = require('vdom-serialized-patch/serialize')
var toJSON = require('vdom-as-json/toJson')
var fromJSON = require('vdom-as-json/fromJson')
var htmlToVDOM = require('to-virtual-dom')
var vdomToHTML = require('vdom-to-html')

//module.exports = function (self) {

  var state = { 'clicks': 0, 'url': '/site.html' }

  var site  = htmlToVDOM(fs.readFileSync('./site.html', 'utf8')) // html string to vdom
  //var other = htmlToVDOM(fs.readFileSync('./other.html', 'utf8'))

  var sitedom = site, newdom = site

  self.addEventListener('message', function (evt) {
    var data = evt.data
    switch ( data.cmd ) {
      case 'echo': self.postMessage({cmd: 'echo', msg: data}); break
      case 'init':
        sitedom = fromJSON(data.sitedom);
        console.log('init worker')
        break
      case 'inc':
        state.clicks += 1
        render()
        break
    }
  }, false)


  function render () {
    newdom = app(state)
    var patches = diff(sitedom, newdom)
    sitedom = htmlToVDOM(vdomToHTML(newdom)) // copy
    self.postMessage({cmd: 'paint', patches: toJSON(patches)})
  }

  function app (state) {
    var tdom, pagevars = {}
    if ( '/site.html' === state.url ) {
      tdom = site
      pagevars = {'title': 'yes', '#count': state.clicks, 'button': {onclick: onclick, _html: 'hey'}}
      function onclick (evt) {
        console.log('clicked')
        evt.preventDefault()
        worker.postMessage({cmd: 'inc'})
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

  function shaved (vdom, pagevars) {
    vdom.children[0].children[1].children[0].text = 'hey there'
    vdom.children[2].children[1].children[1].children[0].text = state.clicks
    return vdom
  }

//}

