var patch = require('virtual-dom/patch')
var virtualize = require('vdom-virtualize')
var toJSON = require('vdom-as-json/toJson')
var fromJSON = require('vdom-as-json/fromJson')

var rootnode = document.documentElement
var sitedom = virtualize(rootnode)

document.body.addEventListener('click', function (evt) {
  if ( 'A' === evt.target.tagName && evt.target.host === window.location.host ) {
    evt.preventDefault()
    //render()
  }
})

window.addEventListener('popstate', function () {
  //worker.postMessage({'url': location.pathname})
})

document.querySelector('button').onclick = function (evt) {
  console.log('clicked')
  evt.preventDefault()
  worker.postMessage({cmd: 'inc'})
}

function paint (data) {
  window.requestAnimationFrame(function () {
    var ret = patch(rootnode, fromJSON(data))
  })
  if ( location.pathname !== data.url ) {
    //history.pushState(null, null, data.url)
  }
}

var worker = new Worker('testworkerb.js')
worker.addEventListener('message', function (evt) {
  var data = evt.data
  switch ( data.cmd ) {
    case 'echo': console.log(data.msg, state); break
    case 'paint': paint(fromJSON(data.patches)); break
  }
}, false)
worker.postMessage({cmd: 'init', sitedom: toJSON(sitedom)})

console.log('init main')
