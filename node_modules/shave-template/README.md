# shave-template

Content insertion is accomplished by targeting standard HTML tag names and other CSS selectors.

This module allows you to develop plain HTML/CSS templates with dummy data in the places dynamic
data will be inserted. The benefit is that the templates can be developed independently from the
programming that dynamically incorporates data into the web page.

You can also use this module to build dynamic lists and tables. Use a selector to identify a
portion of the provided template, such as a list item or a table row, and this module  will use
it as a sub-template to be duplicated and populated with dynamic data for each member of a given
array.

It also provides for layering templates. A page template can be wrapped by a sub-section template,
those together can be wrapped by a section template, and those by a site template. The number of
nested template layers is unlimited.

Once the templates are compiled, this module applies an object you've provided that
identifies CSS selectors as key names paired with values, and replaces (or appends/prepends) the
default content of the elements in the templates that are identified by the corresponding CSS
selectors with the provided values.

Input templates values may be type string or virtual-dom object.

This module returns a virtual-dom object useful for DOM-diffing.

### example

```
var fs = require('fs')
var main = require('main-loop')
var shaved = require('shave-template')

var button = fs.readFileSync('public/button.html', 'utf-8')

var loop = main({ n: 0 }, render, require('virtual-dom'))
document.querySelector('#content').appendChild(loop.target)

function render (state) {
  return shaved(button, {
    '#count': state.n,
    'button': {onclick: onclick}
  })
  function onclick () {
    loop.update({ n: state.n + 1 })
  }
}
```

button.html

```
    <h1>clicked <span id="count">0</span> times</h1>
    <button>click me!</button>
```

index.html

```
<!doctype html>
<html>
  <body>
    <div id="content"></div>
    <script src="bundle.js"></script>
  </body>
</html>
```

Execute `npm run build` or `browserify -t brfs examples/index.js > examples/public/bundle.js` to compile the example code, then load the index.html file in a browser.

### layering templates and map example

```
var outer = fs.readFileSync('public/outer.html', 'utf-8')
var section = fs.readFileSync('public/section.html', 'utf-8')
var template = fs.readFileSync('public/template.html', 'utf-8')

shaved([outer, section, template], {
  '#sectionheader': 'Start Here:',
  'div#message': {class: 'myclass', '_html': 'Clicker ready.'},
  '#clicks': 'Clicks: ' + state.n,
  '#mapme': {_map: {'li': ['one', 'two', 'three', 'four']}},
  'button': {onclick: onclick, '_html': 'click here'}
})
```

### license

MIT
