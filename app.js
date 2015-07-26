var express = require('express');
var session = require('express-session');
var fs= require("fs");
var router = require("./router.js");
var bodyParser = require("body-parser");
var app = express();

var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log('C is online at', host, port);
});


//MIDDLEWARE
//for handling post requests
app.use(bodyParser.urlencoded({ extended: false }));

//for sessions
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 1800000 }}));


//create new doc (too heavy for get handlig)
app.post('/create-new-doc',function(req,res){
	var post  = req.body;
	fs.readFile("./func/workNum.txt","utf8",function(err,data){
		if(err) {
			console.log(err);
			throw err;
		}
		else {

			//for valid url generation
			worknum=parseInt(data);
			res.writeHead("200", {
				"Content-Type": "text/html",
				"Content-Language": "ru"
			});
			fs.writeFile("./func/workNum.txt", (worknum+1));

			//make dir with all needed files
			var path="./html/"+worknum+"/";
			var info = {
					title   : post.title,
					versions: [post.author]
				}

			fs.mkdir("./html/"+worknum, function(){
				fs.writeFile(path+"text.txt", post.text);
				fs.writeFile(path+"info.json", JSON.stringify(info));
				fs.mkdir(path+author);
			});


			res.write(post.title+" by "+post.author+":<br>"+post.text+"<br><br>Work will have num:"+worknum);
			res.end();
		}
	});
});

//url responce
app.get(/.*/,function(req,res){
	var sess = req.session;
	router.direct(req,res,sess);
});

