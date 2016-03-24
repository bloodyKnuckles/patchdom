# patchdom

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
