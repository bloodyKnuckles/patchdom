var shaved = require('../')
var fs = require('fs')
var main = require('main-loop')
var vdom = require('vdom-virtualize')

//var template = fs.readFileSync('examples/public/template.html', 'utf-8')
//var simple = fs.readFileSync('examples/public/simplebutton.html', 'utf-8')
var outer = fs.readFileSync(__dirname + '/public/mainsimple.html', 'utf-8')
var section = fs.readFileSync('examples/public/section.html', 'utf-8')
var inner = fs.readFileSync('examples/public/button.html', 'utf-8')

var loop = main({ n: 0 }, render, require('virtual-dom'))
document.querySelector('#content').appendChild(loop.target)

function render (state) {
/*
  return shaved(template, {
    'div#message': {class: 'testing132', '_html': 'yup'},
    '#clicks': 'Clicks: ' + state.n,
    '#mapme': {_map: {'li': ['one', 'two', 'three', 'four']}},
    'button': {type: 'button', onclick: onclick, '_html': 'click me?'}
  })
/*/ 
  return shaved([outer, section, inner], {
    '#count': state.n,
    'button': {onclick: onclick}
  })
//*/
  function onclick () {
    loop.update({ n: state.n + 1 })
  }
}
