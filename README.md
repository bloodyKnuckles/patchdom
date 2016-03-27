# patchdom

Testing Virtual-DOM and Web Worker technologies.

### install
1. `npm i wzrd -g`
2. `git clone https://github.com/bloodyKnuckles/patchdom.git && cd patchdom`
3. `npm i virtual-dom vdom-parser shave-template`
4. `npm i https://github.com/bloodyKnuckles/virtual-dom.git`
5. `npm i https://github.com/bloodyKnuckles/vdom-as-json.git`
6. `npm i https://github.com/bloodyKnuckles/to-virtual-dom.git`

### run
1. `browserify worker.js > workerb.js`
2. `wzrd index.js:bundle.js`
3. View wzrd provided url in browser.

### features
* Standalone, plain HTML files as templates
* Curly-brackets-free data binding
* Offloading template/data compilation and VDOM diffing to **Web Worker**

### demo

[http://bloodyknuckles.neocities.org/patchdom/](http://bloodyknuckles.neocities.org/patchdom/)

### development notes

* Functions don't pass the Web Worker thread barrior. `vdom-as-json` and `vdom-serialized-patch` simply replace the function with an empty object. The response here is to `toString` the function and `eval` it on the other end.
* Scope is an issue when updating a function in the DOM. Apparently the newly updated function doesn't fall under the same scope the initial function had. The response here is to put what goes out of scope under the `window` scope.

### library modifications

* `virtual-dom`: `vtree/diff-props.js` ln:20, added function check and comparision excluding whitespace, to minimize diff patch.
* `vdom-as-json`: 
  - `lib/fromJson.js` ln:25, added function as string check and `eval`ing string to return to function.
  - `lib/toJson.js` ln:109, added function check and converting to string type.
* `to-virtual-dom`: `src/index.js` 
  - ln:5, added `VText` for ln:34.
  - ln:34, return VText.
  - ln:46, return object with empty attributes object, to minimize diff patch.
  - ln:65, check for HTML node, then remove child nodes before HEAD and text nodes at end.
  - ln:76, don't throw error, rather wrap in DIV node.
  - ln:88, remove DOCTYPE tag and anything after HTML close tag, for diff purposes.

### license

MIT
