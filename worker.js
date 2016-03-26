var diff = require('virtual-dom/diff')
var shaved = require('shave-template')
var toJSON = require('vdom-as-json/toJson')
var fromJSON = require('vdom-as-json/fromJson')
var htmlToVDOM = require('to-virtual-dom')

var templates = {}, sitedom
var tools = {
  getTemplate: function (key, path, cb) {
    if ( undefined === templates[key] ) {
      var xhr = new XMLHttpRequest()
      xhr.onload = function () {
        cb(htmlToVDOM(templates[key] = this.responseText))
      }
      xhr.open('GET', path)
      xhr.send()
    }
    else { cb(templates[key]) }
  }
}

var app = require('./app')(tools)

self.addEventListener('message', function (evt) {
  var data = evt.data, newdom
  switch ( data.cmd ) {
    case 'echo': self.postMessage({cmd: 'echo', msg: data}); break
    case 'init':
      sitedom = fromJSON(data.sitedom);
      console.log('init worker')
      break
    default:
      app(data, function (vdom, content) {
        newdom = shaved(vdom, content)
        self.postMessage({cmd: 'paint', patches: toJSON(diff(sitedom, newdom))})
        sitedom = newdom
      })
  }
}, false)
