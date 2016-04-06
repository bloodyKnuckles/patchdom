var diff = require('virtual-dom/diff')
var toJSON = require('vdom-as-json/toJson')
var fromJSON = require('vdom-as-json/fromJson')
var htmlToVDOM = require('to-virtual-dom')
var shaved = require('shave-template')
var XHR = require('xhr-promise-bare')

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
    self.postMessage({cmd: 'paint', patches: toJSON(diff(sitedom, newdom))})
    sitedom = newdom
  }

  function getTemplate (path) {
    if ( undefined === templates[path] ) {
      return XHR(path).then(function (response) {
        return htmlToVDOM(templates[path] = response)
      }, function (error) {
        console.error('failed XHR', error);
      })
    }
    else { return Promise.resolve(templates[path]) }
  }

}, false)
