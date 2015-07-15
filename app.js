var express = require('express');
var fs      = require("fs");
var router  = require("./router.js");
var app     = express();

var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log('C is online at', host, port);
});
//server.on('request', function(req,res){});
app.get('/off', function (req, res) {
	res.send("Bye");
	process.exit(0);
});
app.get(/.*/,function(req,res){
	router.direct(req,res);
});
