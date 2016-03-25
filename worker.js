var diff = require('virtual-dom/diff')
var shaved = require('shave-template')
var toJSON = require('vdom-as-json/toJson')
var fromJSON = require('vdom-as-json/fromJson')

var app = require('./app')

var sitedom

self.addEventListener('message', function (evt) {
  var data = evt.data
  switch ( data.cmd ) {
    case 'echo': self.postMessage({cmd: 'echo', msg: data}); break
    case 'init':
      sitedom = fromJSON(data.sitedom);
      console.log('init worker')
      break
    default:
      render(shaved(app(data)))
  }
}, false)


function render (newdom) {
  var patches = diff(sitedom, newdom)
  sitedom = newdom
  self.postMessage({cmd: 'paint', patches: toJSON(patches)})
}
