// init user

import jquery from './jquery/jquery.js';

function init_user () {
    var _login = document.getElementById('login'),
	_logout = document.getElementById('logout'),
	_submit = document.getElementById('submit');

    _login.addEventListener('click', login),
    _submit.addEventListener('click', do_login),
    _logout.addEventListener('click', logout),

    user_onoff(),
    submit_onoff(!1)
}

function login (e) {
    var lp = document.getElementById('login-page'),
	_user = document.getElementById('_user'),
	token = document.getElementById('token')	    

    if (!lp.hidden) { /* hidden login page */
	login_onoff(!0),
	reset_one({}, !0)
    } else {
	jquery.ajax({
	    type: 'GET',
	    url: '/login',
	    load: function (data, xhr) {
		var e = JSON.parse(data);
		
		if (e.token != token.value) {
		    token.value = e.token
		}
		
		login_onoff(!1)
	    },
	    error: function (e, xhr) {
		console.log(e.message),
		
		login_onoff(!1)
	    }
	})
    }
    
    e.preventDefault();
}

function do_login () {
    submit_onoff(!0);
    
    var token = document.getElementById('token'),
	username = document.getElementById('username').value,
	password = document.getElementById('password').value;
    
    jquery.ajax({
	type: 'POST',
	url: '/login',
	data: JSON.stringify({
	    token: token.value,
	    username: username,
	    password: password
	}),
	headers: {
	    'Content-Type': 'application/json',
	},
	load: function (data, xhr) {
	    login_onoff(!0),
	    reset_one({}, !0),
	    submit_onoff(!1),
	    user_onoff(JSON.parse(data), !0)
	},
	error: function (e, xhr) {
	    console.log(e.message),
	    reset_one(e),
	    submit_onoff(!1),
	    user_onoff()
	}
    })
}

function logout (e) {
    e.preventDefault();

    var token = document.getElementById('token'),
	user = document.getElementById('user'),
	_user = document.getElementById('_user'),
	loggin = document.getElementById('login'),
	logout = document.getElementById('logout'),
	call = function () {
	    user_onoff('', !1)
	    token.value = '';
	    
	    // var _t = document.getElementById('token'),
	    // _u = document.getElementById('_user');
	    // console.log(_t, _u)
	};

    if (!token.value) {
	user_onoff(!1)
    } else {
	jquery.ajax({
	    type: 'POST',
	    url: '/logout',
	    data: JSON.stringify({
		token: token.value,
		user: user
	    }),
	    headers: { 'Content-Type': 'application/json' },
	    load: call,
	    error: call
	})
    }
}

function user_onoff () {
    var data, trigger, 
	length = arguments.length,
	user = document.getElementById('user'),
	_user = document.getElementById('_user'),
	loggin = document.getElementById('login'),
	logout = document.getElementById('logout');

    if (data = arguments[0], length == 1) {
	trigger = data, data = void 0
    } else {
	trigger = arguments[1]
    }
    
    (data || data == '') && ! function (e) {
	user.text = '[' + e + ']',
	user.href = '/user/' + e,
	_user.value = e
    } (typeof data == 'object' ? data.user : data)
    
    if (!length && _user.value == '') {
	return
    }

    ! function (e) { /* user bar trigger */
	user.hidden = logout.hidden = !e
	loggin.hidden = e 
    } (trigger == void 0 ? !0 : trigger)
}

// function reset_field () {}
function reset_one (e, reset) {
    jquery.each({
	username: document.getElementById('username'),
	password: document.getElementById('password')
    }, function (_, node) {
	reset && node.setAttribute('placeholder', node.getAttribute('string')),
	e.key && node.setAttribute('placeholder', e.key == _ ?
				   e.message.toLowerCase() || 'error' : node.getAttribute('string'))
	node.value = '';
    })
}

function login_onoff(trigger) {
    var lp = document.getElementById('login-page');
    
    lp.hidden = trigger != void 0 ? trigger : !lp.hidden
}

function submit_onoff(trigger) {
    var submit = document.getElementById('submit');
    
    submit.disabled = trigger
}

export default init_user;
