import jquery from './core.js';

jquery.extend({
    ajaxset: {
	xhr: function () {
	    try {
		return new XMLHttpRequest()
	    } catch (e) {}
	},
	type: 'GET',
	url: location.href,
	contentType: "application/x-www-form-urlencoded; charset=UTF-8",
	async: true

	/*
	  data: '',
	  headers: {},
	  username: undefined,
	  password: undefined
	*/
    },
    ajax: function (options) {
	options = options || {};

	var ajaxport, completed, res_headers_raw,
	    req_headers = {},
	    e = jquery.extend(jquery.extend({}, jquery.ajaxset), options),
	    context = e.context || e,
	    jqueryxhr = {
		readyState: 0,
		getAllResponseHeaders: function () {
		    return completed ? res_headers_raw : null
		},
		setRequestHeader: function (name, value) {
		    if (completed == null)
			req_headers[name] = value
		},
		abort: function () {

		},		
	    },
	    deferred = jquery.Deferred();

	e.type = e.type.toUpperCase();
	
	for (var _e in e.headers) {
	    jqueryxhr.setRequestHeader(_e, e.headers[_e])
	}
	
	deferred.promise(jqueryxhr),
	jqueryxhr.done(e.load).fail(e.error);

	if (completed) {
	    return jqueryxhr
	}
	
	if (ajaxport = jquery.ajaxport(e), ajaxport) {
	    jqueryxhr.readyState = 1;
	    
	    try {
		completed = false,
		ajaxport.send(req_headers, complete)
	    } catch (e) {
		if (completed) throw e
	    }
	}
	
	function complete (status, statusText, response, headers) {
	    var success, data, error,
		res_headers_raw = headers || '';
	    
	    if (completed) {
		return
	    }

	    completed = true,
	    ajaxport = undefined,
	    
	    success = status >= 200 && status < 300 || status == 304;

	    if (response) {
		// response = ajaxres(e, jqueryxhr, response)
		// response = ajaxconvert(e, jqueryxhr, response)		
		jqueryxhr.responseText = response
	    }

	    if (success) {
		if (status == 204) {
		    statusText = 'no content'
		} else if (status == 304) {
		    statusText = 'not modified'
		} else {
		    statusText = 'success', // response.state,
		    data = response, // response.data,
		    error = false, // response.error
		    success = !error
		}
	    } else {
		if (response) {
		    error = JSON.parse(response).error
		} else {
		    error = statusText
		}
		
		status = status < 0 ? 0 : status,
		statusText = statusText || 'error'
	    }

	    jqueryxhr.readyState =  status > 0 ? 4 : 0,
	    jqueryxhr.status = status,
	    jqueryxhr.statusText = statusText;

	    if (success) {
		deferred.resolveWith(context, [data, jqueryxhr])
	    } else {
		deferred.rejectWith(context, [error, jqueryxhr])
	    }
	}

	return jqueryxhr
    },
    ajaxport: function (options) {
	var callback;

	if (ajaxSupport && !options.crossDomain) {
	    return {
		send: function (headers, complete) {
		    var xhr = options.xhr();

		    xhr.open(
			options.type,
			options.url,
			options.async,
			options.username,
			options.password);

		    if (!options.crossDomain && !headers['X-Requested-With']) {
			xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
		    }
		    
		    for (var e in headers) {
			xhr.setRequestHeader(e, headers[e])
		    }

		    callback = function (e) {
			return function () {
			    callback = xhr.onload = xhr.onerror =
				xhr.onabort = xhr.ontimeout = null;
			    
			    if (e =='abort') { 
				xhr.abort()
			    } else if (e == 'error') {
				complete(
				    xhr.status,
				    xhr.statusText
				)
			    } else {
				complete(
				    xhr.status,
				    xhr.statusText,
				    xhr.responseText,
				    xhr.getAllResponseHeaders()
				)
			    }
			}
		    }

		    xhr.onload = callback(),
		    xhr.onerror = xhr.onabort = xhr.ontimeout = callback('error');

		    callback = callback('abort');

		    try {
			xhr.send(options.data || null)
		    } catch (e) {
			if (callback) throw e
		    }
		},
		abort: function () {
		    if (callback) callback()
		}
	    }
	}
    }
});

var ajaxSupport = !!jquery.ajaxset.xhr(),
    ajaxresfn = function () {
	
    };

export default jquery;
