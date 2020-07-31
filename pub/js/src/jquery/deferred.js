import jquery from './core.js';
import './callbacks.js';

jquery.extend({
    Deferred: function (fn) {
	var tuples = [
	    // action, add listener, callbacks, handlers, argument index, [final state]
	    [ "notify", "progress", jquery.Callbacks( "memory" ), jquery.Callbacks( "memory" ), 2 ],
	    [ "resolve", "done", jquery.Callbacks( "once memory" ), jquery.Callbacks( "once memory" ), 0, "resolved" ],
	    [ "reject", "fail", jquery.Callbacks( "once memory" ), jquery.Callbacks( "once memory" ), 1, "rejected" ]
	],
	    promise = {
		state: function() {
		    return state;
		},
		always: function() {
		    deferred.done( arguments ).fail( arguments );
		    return this;
		},
		catch: function( fn ) {
		    return promise.then( null, fn );
		},
		pipe: function( /* fnDone, fnFail, fnProgress */ ) {
		    var fns = arguments;

		    return jquery.Deferred( function( newDefer ) {
			jquery.each( tuples, function( i, tuple ) {

			    // Map tuples (progress, done, fail) to arguments (done, fail, progress)
			    var fn = jquery.isFn( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

			    // deferred.progress(function() { bind to newDefer or newDefer.notify })
			    // deferred.done(function() { bind to newDefer or newDefer.resolve })
			    // deferred.fail(function() { bind to newDefer or newDefer.reject })
			    deferred[ tuple[ 1 ] ]( function() {
				var returned = fn && fn.apply( this, arguments );
				if ( returned && jquery.isFn( returned.promise ) ) {
				    returned.promise()
					.progress( newDefer.notify )
					.done( newDefer.resolve )
					.fail( newDefer.reject );
				} else {
				    newDefer[ tuple[ 0 ] + "With" ](
					this,
					fn ? [ returned ] : arguments
				    );
				}
			    } );
			} );
			fns = null;
		    } ).promise();
		},
		then: function( onFulfilled, onRejected, onProgress ) {
		    var maxDepth = 0;
		    function resolve( depth, deferred, handler, special ) {
			return function() {
			    var that = this,
				args = arguments,
				mightThrow = function() {
				    var returned, then;

				    // Support: Promises/A+ section 2.3.3.3.3
				    // https://promisesaplus.com/#point-59
				    // Ignore double-resolution attempts
				    if ( depth < maxDepth ) {
					return;
				    }

				    returned = handler.apply( that, args );

				    // Support: Promises/A+ section 2.3.1
				    // https://promisesaplus.com/#point-48
				    if ( returned === deferred.promise() ) {
					throw new TypeError( "Thenable self-resolution" );
				    }

				    // Support: Promises/A+ sections 2.3.3.1, 3.5
				    // https://promisesaplus.com/#point-54
				    // https://promisesaplus.com/#point-75
				    // Retrieve `then` only once
				    then = returned &&

				    // Support: Promises/A+ section 2.3.4
				    // https://promisesaplus.com/#point-64
				    // Only check objects and functions for thenability
				    ( typeof returned === "object" ||
				      typeof returned === "function" ) &&
					returned.then;

				    // Handle a returned thenable
				    if ( jquery.isFn( then ) ) {

					// Special processors (notify) just wait for resolution
					if ( special ) {
					    then.call(
						returned,
						resolve( maxDepth, deferred, Identity, special ),
						resolve( maxDepth, deferred, Thrower, special )
					    );

					    // Normal processors (resolve) also hook into progress
					} else {

					    // ...and disregard older resolution values
					    maxDepth++;

					    then.call(
						returned,
						resolve( maxDepth, deferred, Identity, special ),
						resolve( maxDepth, deferred, Thrower, special ),
						resolve( maxDepth, deferred, Identity,
							 deferred.notifyWith )
					    );
					}

					// Handle all other returned values
				    } else {

					// Only substitute handlers pass on context
					// and multiple values (non-spec behavior)
					if ( handler !== Identity ) {
					    that = undefined;
					    args = [ returned ];
					}

					// Process the value(s)
					// Default process is resolve
					( special || deferred.resolveWith )( that, args );
				    }
				},

				// Only normal processors (resolve) catch and reject exceptions
				process = special ?
				mightThrow :
				function() {
				    try {
					mightThrow();
				    } catch ( e ) {

					if ( jquery.Deferred.exceptionHook ) {
					    jquery.Deferred.exceptionHook( e,
									   process.stackTrace );
					}

					// Support: Promises/A+ section 2.3.3.3.4.1
					// https://promisesaplus.com/#point-61
					// Ignore post-resolution exceptions
					if ( depth + 1 >= maxDepth ) {

					    // Only substitute handlers pass on context
					    // and multiple values (non-spec behavior)
					    if ( handler !== Thrower ) {
						that = undefined;
						args = [ e ];
					    }

					    deferred.rejectWith( that, args );
					}
				    }
				};

			    // Support: Promises/A+ section 2.3.3.3.1
			    // https://promisesaplus.com/#point-57
			    // Re-resolve promises immediately to dodge false rejection from
			    // subsequent errors
			    if ( depth ) {
				process();
			    } else {

				// Call an optional hook to record the stack, in case of exception
				// since it's otherwise lost when execution goes async
				if ( jquery.Deferred.getStackHook ) {
				    process.stackTrace = jquery.Deferred.getStackHook();
				}
				window.setTimeout( process );
			    }
			};
		    }

		    return jquery.Deferred(function (newDefer) {

			// progress_handlers.add( ... )
			tuples[0][3].add(
			    resolve(
				0,
				newDefer,
				jquery.isFn( onProgress ) ?
				    onProgress :
				    Identity,
				newDefer.notifyWith
			    )
			);

			// fulfilled_handlers.add( ... )
			tuples[1][3].add(
			    resolve(
				0,
				newDefer,
				jquery.isFn( onFulfilled ) ?
				    onFulfilled :
				    Identity
			    )
			);

			// rejected_handlers.add( ... )
			tuples[2][3].add(
			    resolve(
				0,
				newDefer,
				jquery.isFn( onRejected ) ?
				    onRejected :
				    Thrower
			    )
			);
		    } ).promise();
		},
		// Get a promise for this deferred
		// If obj is provided, the promise aspect is added to the object
		promise: function( obj ) {
		    return obj != null ? jquery.extend( obj, promise ) : promise;
		}
	    },
	    state = "pending",
	    deferred = {};

	// Add list-specific methods
	jquery.each( tuples, function( i, tuple ) {
	    var list = tuple[ 2 ],
		stateString = tuple[ 5 ];

	    // promise.progress = list.add
	    // promise.done = list.add
	    // promise.fail = list.add
	    promise[ tuple[ 1 ] ] = list.add;

	    // Handle state
	    if ( stateString ) {
		list.add(
		    function() {
			// state = "resolved" (i.e., fulfilled)
			// state = "rejected"
			state = stateString;
		    },

		    // rejected_callbacks.disable
		    // fulfilled_callbacks.disable
		    tuples[ 3 - i ][ 2 ].disable,

		    // progress_callbacks.lock
		    tuples[ 0 ][ 2 ].lock
		);
	    }

	    // progress_handlers.fire
	    // fulfilled_handlers.fire
	    // rejected_handlers.fire
	    list.add( tuple[ 3 ].fire );

	    // deferred.notify = function() { deferred.notifyWith(...) }
	    // deferred.resolve = function() { deferred.resolveWith(...) }
	    // deferred.reject = function() { deferred.rejectWith(...) }
	    deferred[ tuple[ 0 ] ] = function() {
		deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
		return this;
	    };

	    // deferred.notifyWith = list.fireWith
	    // deferred.resolveWith = list.fireWith
	    // deferred.rejectWith = list.fireWith
	    deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
	} );

	// Make the deferred a promise
	promise.promise( deferred );

	// Call given func if any
	if ( fn ) {
	    fn.call( deferred, deferred );
	}

	return deferred;
    }
});

// These usually indicate a programmer mistake during development,
// warn about them ASAP rather than swallowing them by default.
var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

jquery.Deferred.exceptionHook = function( error, stack ) {

	// Support: IE 8 - 9 only
	// Console exists when dev tools are open, which can happen at any time
	if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
		window.console.warn( "jquery.Deferred exception: " + error.message, error.stack, stack );
	}
};
jquery.readyException = function( error ) {
	window.setTimeout( function() {
		throw error;
	} );
};

export default jquery;
