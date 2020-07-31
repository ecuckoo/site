import jquery from './core.js';
import document from './var/document.js';

var jqueryroot,
    init = jquery.fn.init = function (selector, context, root) {
	if (!selector) {
	    return this
	}

	root = root || jqueryroot;
	
	if (selector.nodeType) {
	    return this[0] = selector, this.length = 1, this
	} else if (jquery.isFn(selector)) {
	    return root.ready != undefined ?
		root.ready(selector) : selector(jquery)
	}
    };

init.prototype = jquery.fn;
jqueryroot = jquery(document);

export default jquery;
