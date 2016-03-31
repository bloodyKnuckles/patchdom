var diff = require('virtual-dom/diff')
var shaved = require('shave-template')
var toJSON = require('vdom-as-json/toJson')
var fromJSON = require('vdom-as-json/fromJson')
var htmlToVDOM = require('to-virtual-dom')

var templates = {}, sitedom

var app = require('./app1')

self.addEventListener('message', function (evt) {
  var data = evt.data, newdom, rm

  switch ( data.cmd ) {
    case 'echo': self.postMessage({cmd: 'echo', msg: data}); break
    case 'init':
      sitedom = fromJSON(data.sitedom);
      console.log('init worker')
      break

    default:
      rm = app.match(data.url)
      var pageinfo = rm.fn(data, rm)

      getTemplate(pageinfo.templates, function (vdom) {
        render(vdom, pageinfo.content)
      })

  } // end switch

  function render (vdom, content) {
    newdom = shaved(vdom, content)
    self.postMessage({cmd: 'paint', patches: toJSON(diff(sitedom, newdom))})
    sitedom = newdom
  }

  function getTemplate (path, cb) {
    if ( undefined === templates[path] ) {
      var xhr = new XMLHttpRequest()
      xhr.onload = function () {
        cb(htmlToVDOM(templates[path] = this.responseText))
      }
      xhr.open('GET', path)
      xhr.send()
    }
    else { cb(templates[path]) }
  }

}, false)
