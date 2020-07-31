import document from './var/document.js';

/*
  Dom ready
*/
/*
var readyList = jquery.Deferred();

jquery.fn.ready = function (fn) {
    return this
};
jquery.extend({
    isReady: false,
    ready: function (wait) {

    }
});
jquery.ready.then = readyList.then;

function completed () {
	document.removeEventListener( "DOMContentLoaded", completed );
	window.removeEventListener( "load", completed );
	jquery.ready();
}

if (document.readyState !== "loading") {

	// Handle it asynchronously to allow scripts the opportunity to delay ready
	window.setTimeout( jquery.ready );

} else {

	// Use the handy event callback
	document.addEventListener( 'DOMContentLoaded', completed );

	// A fallback to window.onload, that will always work
	window.addEventListener( 'load', completed );
}
*/
