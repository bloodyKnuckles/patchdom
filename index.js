var patch = require('virtual-dom/patch')
var virtualize = require('vdom-virtualize')
var work = require('webworkify')

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
  console.log(evt.data)
  paint(evt.data)
})

function paint (data) {
  window.requestAnimationFrame(function () {
    patch(rootnode, data.patches)
  })
  if ( location.pathname !== data.url ) {
    history.pushState(null, null, data.url)
  }
}

/*
var fs = require('fs')
var diff = require('virtual-dom/diff')
var shaved = require('shave-template')

var state = { 'clicks': 0, 'url': '/site.html' }

var site  = shaved(fs.readFileSync('./site.html', 'utf8')) // html string to vdom
var other = shaved(fs.readFileSync('./other.html', 'utf8'))

var newdom = site

function render () {
  newdom = app(state)
  var patches = diff(sitedom, newdom)
  sitedom = newdom
  paint({
    'url': state.url,
    'patches': patches
  })
}

function app (state) {
  var tdom, pagevars = {}
  if ( '/site.html' === state.url ) {
    tdom = site
    pagevars = {'title': 'yes', '#count': state.clicks, 'button': {onclick: onclick, _html: 'hey'}}
    function onclick () {
      state.clicks += 1
      render()
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
//*/
