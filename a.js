var db = require('mariadb')

var pool = db.createPool({
    host: 'localhost',
    user: 'e',
    password: 'e',
    connectionLimit: 5
})

pool.getConnection()
    .then(conn => {
	conn.query(
	    `select title, time from site.post where uid = 
(select id from site.user where username = ?) order by id desc`, ['e']
	)
	    .then(res => {
		console.log(res)
	    })
	    .then(() => {
		conn.end()
	    })
	    .catch(e => {
		console.error(e.description)
		conn.end()
	    })
    })
    .catch(e => {
	console.error(e.description)
    })
