import document from './var/document.js';

var jquery = function (selector, context) {
	return new jquery.fn.init(selector, context)
    };

jquery.fn = jquery.prototype = {
    constructor: jquery,
    
    each: function (call) {
	return jquery.each(this, call)
    }
};

jquery.extend = jquery.fn.extend = function () {
    var copy, options, 
	target = arguments[0] || {},
	length = arguments.length;

     if (typeof target !== 'object' && !jquery.isFn(target)) {
     	target = {}
     }
    
    if (length == 1) {
	options = target, target = this
    } else {
	options = arguments[1]
    }

    if (options != null) {
	for (var e in options) {
	    copy = options[e]

	    if (target == copy) {
		continue
	    }
	    
	    if (copy != undefined) {
		target[e] = copy
	    }
	}
    }

    return target
}

jquery.extend({
    isFn: function (e) {
	return typeof e == 'function'
    },
    isnullO: function (e) {
	for (var _e in e) return false
	return true
    },
    isplainO: function (e) {
	
    },
    isArray: function (e) {
	return Array.isArray ? Array.isArray(e) :
	    jquery.type(e) == 'Array'
    },
    inArray: function( elem, arr, i ) {
	    return arr == null ? -1 : indexOf.call( arr, elem, i );
    },
    error: function (msg) {
	throw new Error(msg)
    },
    type: function (e) {
	var _type,
	    e_cons = /function\s(.+?)\s?\(.*\)/,
	    e_type = /\[object\s(.+?)\]/;

	if (_type = typeof e, e != null && _type != 'object') {
	    _type = _type.charAt(0).toUpperCase() + _type.slice(1)
	} else {
	    _type = e == null ? e_type.exec({}.toString.call(e))[1] :
	    e_cons.exec(e.constructor)[1]
	}

	return _type
    },
    each: function (e, call) {
	if(arrayLike(e)) {
	    try {
		for (var _e = 0; _e < e.length; _e++) {
		    if (call.call(e, _e, e[_e]) == false)
			break
		}
	    } catch (e) {
		jquery.error('Erroneous iterable object')
	    }
	} else {
	    for (var _e in e) {
		if(call.call(e, _e, e[_e]) == false)
		    break
	    }
	}

	return e
    }
});

function arrayLike (e) {
    var length;
    return length = !!e && e.length, jquery.isArray(e) ||
	(length == 0 || length > 0 && (length - 1) in e)
}

export default jquery;
