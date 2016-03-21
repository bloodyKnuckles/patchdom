var patch = require('vdom-serialized-patch/patch')
//var patch = require('virtual-dom/patch')
var virtualize = require('vdom-virtualize')
var work = require('webworkify')
var toJSON = require('vdom-as-json/toJson')

var rootnode = document.getElementsByTagName('html')[0]
var sitedom = virtualize(rootnode)

document.body.addEventListener('click', function (evt) {
  if ( 'A' === evt.target.tagName && evt.target.host === window.location.host ) {
    evt.preventDefault()
    worker.postMessage({'url': evt.target.href}) //render()
  }
})

window.addEventListener('popstate', function () {
  worker.postMessage({'url': location.pathname})
})

document.querySelector('button').onclick = function (evt) {
  //state.clicks += 1
  //render()
  evt.preventDefault()
  worker.postMessage({'clicks': 1})
}

var worker = work(require('./worker.js'))
worker.addEventListener('message', function (evt) {
console.log('data: ', evt.data)
  paint(evt.data)
})

worker.postMessage({'sitedom': toJSON(sitedom)})

function paint (data) {
  window.requestAnimationFrame(function () {
console.log('patches: ', data.patches)
    patch(rootnode, data.patches)
  })
  if ( location.pathname !== data.url ) {
    history.pushState(null, null, data.url)
  }
}
