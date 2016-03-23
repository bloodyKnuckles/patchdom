# patchdom

### install
1. npm i wzrd -g
2. git clone https://github.com/bloodyKnuckles/patchdom.git && cd patchdom
3. npm i virtual-dom vdom-as-json vdom-parser shave-template edit-object brfs
5. npm i https://github.com/bloodyKnuckles/vdom-as-json.git
6. npm i https://github.com/bloodyKnuckles/to-virtual-dom.git

### run
7. browserify -t brfs testworker.js > testworkerb.js
8. wzrd index.js:bundle.js

### features
* Standalone, plain HTML files as templates
* Curly-brackets-free data binding
* Offloading template/data compilation and VDOM diffing to *web worker*

