var express = require('express');
var session = require('express-session');
var fs= require("fs");
var router= require("./router.js");
var app = express();

var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log('C is online at', host, port);
});




//sessions
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 10000 }}))
/*app.use("/s",function(req, res, next) {
	var sess = req.session
	if (sess.views) {
		sess.views++;
		res.setHeader('Content-Type', 'text/html');
		res.write('<p>views: ' + sess.views + '</p>');
		res.write('<p>expires in: ' + (sess.cookie.maxAge / 1000) + 's</p>');
		res.end();
	} else {
		sess.views = 1;
		res.end('welcome to the session demo. refresh!');
	}
});*/



//url responce
app.use('/off', function (req, res) {
	res.send("Bye");
	process.exit(0);
});
app.get(/.*/,function(req,res){
	var sess = req.session;
	router.direct(req,res,sess);
});
