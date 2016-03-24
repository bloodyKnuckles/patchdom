var fs = require('fs')
var diff = require('virtual-dom/diff')
var shaved = require('shave-template')
var toJSON = require('vdom-as-json/toJson')
var fromJSON = require('vdom-as-json/fromJson')
var htmlToVDOM = require('to-virtual-dom')

var state = { 'clicks': 0, 'url': '/' }

var site  = htmlToVDOM(fs.readFileSync('./index.html', 'utf8')) // html string to vdom
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
  sitedom = newdom
  self.postMessage({cmd: 'paint', patches: toJSON(patches)})
}

function app (state) {
  var tdom, pagevars = {}
  if (
    '/' === state.url
    || '/index.html' === state.url
  ) {
    tdom = site
    pagevars = {'title': 'yes', '#count': state.clicks, 'button': {onclick: onclick, _html: 'hey'}}
    function onclick (evt) {
      console.log('clicked')
      evt.preventDefault()
      window.worker.postMessage({cmd: 'inc'})
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
