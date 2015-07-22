var url    = require("url");
var fs     = require("fs");
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/my_database_name';
// Use connect method to connect to the Server
MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    //HURRAY!! We are connected. :)
    console.log('Connection established to', url);

    // do some work here with the database.

    //Close connection
    db.close();
  }
});

exports.direct = function(req,res,sess){
	var parsed = url.parse(req.url, true)
	var path = parsed.pathname;
	var query = parsed.query;
	var page = '';
	var work=[];
	var serial=false;
	var version;
	var numbersOnly=new RegExp('^\\d+$');
	//basic scenarios
	console.log("path:",path);
	console.log("url :",req.url);
	if(path=='/s')
	{
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
	}
	else{


	if(!Object.keys(query).length>0){
		switch(true){
			case path=='/' :
				page = 'docs';
				break;
			case path=='/settings' :
				page = "settings";
				break;
			case path=='about' :
				page = "about";
				break;
			case path.indexOf("-")>0||numbersOnly.test(path.split("/")[1]) :
					var urlLvL=1;
					work=path.split("/")[1].split('-');
				/*	fs.readFile("./functional/urlLvL.txt",function(err,data){
						if(err)
						{
							console.log(err);
							throw err;
						}
						else
						{
							urlLvL=parseInt(data);
						}
					});*/
				if(work.length<urlLvL)
				{
					serial=path.split("/")[1]+"/10";
				}
				else
				{
					serial=path.split("/")[1];
				}
				if(path.split("/")[2])
				{
					version=path.split("/")[2];
				}
				else
				{
					version="original";
				}
				page="work";
				break;
			default:
				page = '404';
				break;
		}
		if(!serial)
		{
			fs.readFile("./html/"+page+".html",function(err,data){
				res.writeHead("200", {
					"Content-Type": "text/html",
					"Content-Language": "ru"
				});
				res.write(data);
				res.end();
			});
		}
		else
		{
			fs.readFile("./html/work.html",function(err,data){
				var html = "<!DOCTYPE html><html><head><script> var version='"+version+"'; var serial='"+serial+"'</script>"+data;
				res.writeHead("200", {
					"Content-Type": "text/html",
					"Content-Language": "ru"
				});
				res.write(html);
				res.end();
			});
		}
	}
	else{
		switch (path){
			case "/off":
				res.write("bye");
				res.end();
				process.exit(0);
				break;
			//gets for work
			case "/get-changes":
				fs.readFile("./html/"+query.serial+"/"+query.vers+"/changes.txt",function(err,data){
					if(err){
						res.write("404");
					}
					else{
						res.write(data);
						res.end();
					}
				});
				break;
			case "/get-tools":
				fs.readFile("./html/"+query.serial+"/"+query.vers+"/tools.json",function(err,data){
					console.log("smb requests tools of "+query.vers+" at "+query.serial);
					if(err){
						res.write("404");
					}
					else{
						res.write(data);
						res.end();
					}
				});
				break;
			case "/get-info":
				fs.readFile("./html/"+query.serial+"/info.json",function(err,data){
					if(err){
						res.write("404");
					}
					else{
						res.write(data);
						res.end();
					}
				});
				break;
			case "/get-text":
				fs.readFile("./html/"+query.serial+"/text.txt",function(err,data){
					res.write(data);
					res.end();
				});
				break;
			case "/get-comments":
				fs.readFile("./html/"+query.serial+"/"+query.vers+"/comments/"+query.issue+".txt",function(err,data){
					if(err){
						res.write("404");
					}
					else{
						res.write(data);
						res.end();
					}
				});
				break;
			//generate work folder
			case "/newDoc":
				res.write("undone");
				res.end();
				break;
			default:
				res.write("error");
				res.end();
				break;
		}
	}
	//del after session come to work
	}
	//nothing more to del
}