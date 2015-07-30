var url    = require("url");
var fs     = require("fs");

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
	if(!Object.keys(query).length>0){
		res.writeHead("200", {
			"Content-Type": "text/html",
			"Content-Language": "ru"
		});
		switch(true){
			case path=='/' :
				//USER'S DOCS
				page = 'docs';
				break;
			case path=='/settings' :
				//setting(maybe'll add some)
				page = "settings";
				break;
			case path=='about' :
				//about projec me etc.
				page = "about";
				break;
			case path=='/new' :
				//New doc creation page (will transfer it in popup later)
				page = 'newdoc';
				break;
			//work url handling
			case path.indexOf("-")>0||numbersOnly.test(path.split("/")[1]) :
				var urlLvL=1;
				work=path.split("/")[1].split('-');
				fs.readFile("./func/urlLvL.txt","utf8",function(err,data){
					if(err) {
						console.log(err);
						throw err;
					}
					else {
						urlLvL=parseInt(data);
					}
				});
				if(work.length<urlLvL) {
					serial=path.split("/")[1]+"/10";
				}
				else {
					serial=path.split("/")[1];
				}
				if(path.split("/")[2]) {
					version=path.split("/")[2];
				}
				else {
					version="original";
				}
				page="work";
				break;
			default:
				page = '404';
				break;
		}
		if(!serial) {
			//not work url
			fs.readFile("./html/"+page+".html",function(err,data){
				res.write(data);
				res.end();
			});
		}
		else {
			//give work ui and souces for ajax
			fs.readFile("./html/work.html",function(err,data){
				var html = "<!DOCTYPE html><html><head><script> var version='"+version+"'; var serial='"+serial+"'</script>"+data;
				res.write(html);
				res.end();
			});
		}
	}
	else{
		switch (path){
			//turn server off
			case "/off":
				res.write("bye");
				res.end();
				process.exit(0);
				break;
			//check if loged in
			case "/check-login" :
				if(!sess.user)
				{
					res.write("unlog");
					res.end();
				}
				else
				{
					res.write(JSON.stringify(sess.user));
					res.end();
				}
				break;
			//log in
			case "/login" :
				fs.readFile("./func/users.json",'utf8', function(err, data){
					if(err){
						res.write(err);
						res.end();
					}
					else
					{
						res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
						data="{"+data+"}";
						var users = JSON.parse(data);
						if(users[query.email])
						{
							if(users[query.email].password==query.password)
							{
								sess.user = {};
								sess.user.email = query.email;
								sess.user.firstName  = users[query.email].firstName;
								sess.user.lastName  = users[query.email].lastName;
								res.write("ok");
							}
							else
							{
								res.write("pass");
							}
						}
						else
						{
							res.write("unreg");
						}
						res.end();
					}
				});
				break;
			//register
			case "/register" :
				fs.readFile("./func/users.json",'utf8', function(err, data){
					if(err){
						console.log("the fuck");
						res.write(err);
						res.end();
					}
					else
					{
						data="{"+data+"}";
						var users = JSON.parse(data);
						if(users[query.email])
						{
							if(users[query.email].password==query.password)
							{
								sess.user = {};
								sess.user.email = query.email;
								sess.user.firstName  = users[query.email].firstName;
								sess.user.lastName  = users[query.email].lastName;
								res.write("was reged");
								res.end();
							}
							else
							{
								res.write("was reged,pass");
								res.end();
							}
						}
						else
						{
							newUser='"'+query.email+'":{"password":"'+query.password+'","firstName":"'+query.firstName+'","lastName":"'+query.lastName+'"}';
							fs.appendFile("./func/users.json", (","+newUser),function(err){
								if(err)
								{
									console.log(err);
									throw err;
								}
								else
								{
									sess.user = {};
									sess.user.email = query.email;
									sess.user.firstName  = query.firstName;
									sess.user.lastName  = query.lastName;
									res.write("done");
									res.end();
								}
							});
						}

					}
				});
				break;
			//gets for document( ajaxed form work UI)
			case "/get-changes":
				fs.readFile("./html/"+query.serial+"/"+query.vers+"/changes.txt",function(err,data){
					if(err){
						res.write(err);
					}
					else{
						res.write(data);
						res.end();
					}
				});
				break;
			case "/get-tools":
				fs.readFile("./html/"+query.serial+"/"+query.vers+"/tools.json",function(err,data){
					if(err){
						res.write(err);
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
						res.write(err);
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
						res.write(err);
					}
					else{
						res.write(data);
						res.end();
					}
				});
				break;
			default:
				res.write("error");
				res.end();
				break;
		}
	}
}