var fs = require('fs')
var htmlToVDOM = require('to-virtual-dom')

var state = { 'clicks': 0, 'url': '/' }

var site  = htmlToVDOM(fs.readFileSync('./index.html', 'utf8')) // html string to vdom
//var other = htmlToVDOM(fs.readFileSync('./other.html', 'utf8'))

module.exports = function (data) {
  var vdom, content = {}

  if ( 'url' === data.cmd ) {
    state.url = data.url
  }

  if ( '/' === state.url
    || '/index.html' === state.url
  ) {

    if ( 'inc' ===  data.cmd ) {
      state.clicks += 1
    }
    vdom = site
    content = {'title': 'yes', '#count': state.clicks, 'button': {onclick: onclick, _html: 'hey'}}
    function onclick (evt) {
      console.log('clicked')
      evt.preventDefault()
      window.worker.postMessage({cmd: 'inc'})
    }
  }

  else if ( '/other.html' === state.url ) {
    vdom = other
    content = {'title': 'hey', '#msg': 'there you go'}
  }

  else { // home
    content = {'title': 'home', '#msg': 'home sweet home'}
  }

  return {vdom: vdom, content: content}
}
