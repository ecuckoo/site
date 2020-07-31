var pug=require('pug')

/*
var fn=pug.compileFile('index.pug')

console.log(fn({
	h1title: 'h1 title'
}))
*/

// pug.renderFile('index.pug', {
// 	title: 'index',
// 	h1title: 'h1-title',
// 	pretty: true,
// 	cache: true,
// }, (e, data) => {
// 	console.log(data)
// })


pug.renderFile('../views/error.pug', {
	title: 'Error 404',
	status: 404,
	message: 'Page Not Found',
	pretty: true,
	cache: true,
}, (e, data) => {
	console.log(data)
})
