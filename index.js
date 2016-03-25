var patch = require('virtual-dom/patch')
var toJSON = require('vdom-as-json/toJson')
var fromJSON = require('vdom-as-json/fromJson')
var vdomparser = require('vdom-parser')

document.body.addEventListener('click', function (evt) {
  if ( 'A' === evt.target.tagName && evt.target.host === window.location.host ) {
    evt.preventDefault()
    //window.worker.postMessage({cmd: 'url', url: location.pathname})
  }
})

window.addEventListener('popstate', function () {
  //window.worker.postMessage({cmd: 'url', url: location.pathname})
})

document.querySelector('button').onclick = (function onclick(evt) {
  console.log('clicked')
  evt.preventDefault()
  window.worker.postMessage({cmd: 'inc'})
})

var rootnode = document.documentElement
var sitedom = vdomparser(rootnode)

window.worker = new Worker('workerb.js') // local scope issues
window.worker.addEventListener('message', function (evt) {
  var data = evt.data
  switch ( data.cmd ) {
    case 'echo': console.log(data.msg); break
    case 'paint': paint(fromJSON(data.patches)); break
  }
}, false)
window.worker.postMessage({cmd: 'init', sitedom: toJSON(sitedom)})

console.log('init main')

function paint (data) {
  window.requestAnimationFrame(function () {
    var ret = patch(rootnode, data)
  })
  if ( location.pathname !== data.url ) {
    //history.pushState(null, null, data.url)
  }
}

