var diff = require('virtual-dom/diff')
var toJSON = require('vdom-as-json/toJson')
var fromJSON = require('vdom-as-json/fromJson')
var htmlToVDOM = require('to-virtual-dom')
var shaved = require('shave-template')
var XHR = require('xhr-promise-bare')
//var XHR = require('../../modules/xhr-promise-bare/index.js')

var patchView = require('../../modules/virtual-dom-patch-viewer/index.js')

var templates = {}, sitedom

var app = require('./app')

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
      rm.fn(data, rm).then(function (pageinfo) {
        getTemplate(pageinfo.templates).then(function (vdom) {
          render(vdom, pageinfo.content)
        })
      })

  } // end switch

  function render (vdom, content) {
    newdom = shaved(vdom, content)
    var pp = diff(sitedom, newdom)
console.log(sitedom)
console.log(newdom)
//console.log(pp)
patchView(pp)
    self.postMessage({cmd: 'paint', patches: toJSON(pp)})
    //self.postMessage({cmd: 'paint', patches: toJSON(diff(sitedom, newdom))})
    sitedom = newdom
  }

  function getTemplate (paths) {
    if ( 'string' === typeof paths ) {
      paths = [paths]
    }
    var xhrs = paths.map(function (path) {
      return XHR(path)
    })
    if ( undefined === templates[paths.join(',')] ) {
      return Promise.all(xhrs).then(function (templates) {
        return shaved(templates)
      })
    }
    else { return Promise.resolve(templates[paths.join(',')]) }
  }

}, false)
