var state = { 'clicks': 0, 'url': '/' }

module.exports = function (tools) {

  return function (data, callback) {
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
      tools.getTemplate('site', '/index.html', function (vdom) {
        callback(
          vdom,
          {'title': 'yes', '#count': state.clicks, 'button': {onclick: onclick, _html: 'hey'}}
        )
      })
      function onclick (evt) {
        console.log('clicked')
        evt.preventDefault()
        window.worker.postMessage({cmd: 'inc'})
      }
    }

    else if ( '/other.html' === state.url ) {
      getTemplate('other', '/other.html', function (vdom) {
        callback(
          vdom,
          {'title': 'hey', '#msg': 'there you go'}
        )
      })
    }

    else { // home
      getTemplate('other', '/other.html', function (vdom) {
        callback(
          vdom,
          {'title': 'home', '#msg': 'home sweet home'}
        )
      })
    }

  } // end return function
} // end module.exports
