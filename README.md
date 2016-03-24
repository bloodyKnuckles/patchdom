# patchdom

Testing out Virtual-DOM and Web Worker technologies.

### install
1. `npm i wzrd -g`
2. `git clone https://github.com/bloodyKnuckles/patchdom.git && cd patchdom`
3. `npm i virtual-dom vdom-as-json vdom-parser shave-template brfs`
5. `npm i https://github.com/bloodyKnuckles/vdom-as-json.git`
6. `npm i https://github.com/bloodyKnuckles/to-virtual-dom.git`

### run
7. `browserify -t brfs worker.js > workerb.js`
8. `wzrd index.js:bundle.js`
9. View wzrd provided url in browser.

### features
* Standalone, plain HTML files as templates
* Curly-brackets-free data binding
* Offloading template/data compilation and VDOM diffing to **Web Worker**

### demo

[http://bloodyknuckles.neocities.org/patchdom/](http://bloodyknuckles.neocities.org/patchdom/)

### development notes

* Functions don't pass the Web Worker thread barrior. `vdom-as-json` and `vdom-serialized-patch` simply replace the function with an empty object. The response here is to `toString` the function and `eval` it on the other end.
* Scope is an issue when updating a function in the DOM. Apparently the newly updated function doesn't fall under the same scope the initial function had. The response here is to put what goes out of scope under the `window` scope.

### license

MIT
