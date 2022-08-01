var http = require('http');
var fs = require("fs");
var qs = require("querystring");
const { fileURLToPath } = require('url');
const { isBuffer } = require('util');

var MongoClient = require("Mongodb").MongoClient;
var dbUrl = "mongodb://localhost:27017/";
//create a server object:
http.createServer(function (req, res) {
   
    if(req.url === "/apple"){
res.write('Hello World!'); //write a response to the client
        res.end(); //end the response
}else if(req.url === "/profile"){
    sendFileContent(res, "profile.html", "text/html");
}else if(req.url === "/changepassword"){
    if(req.method == "POST"){
        console.log("this is change password page");
        return req.on('data', function(data){
            formdata = '';
            formdata += data;
            console.log(formdata);
            data = qs.parse(formdata);
            username = data['u_username'];
            oldpwd = data['u_oldpwd'];
            newpwd = data['u_newpwd'];
            console.log(username+oldpwd+newpwd);

            MongoClient.connect(dbUrl, function(err,db){
                var dbo = db.db("shop");
                var userobj = {"username":username,"password":oldpwd};
                dbo.collection("customer").find(userobj).toArray(function(err,result){
                    if(err) throw err;
                    console.log(result);
                    if(result.length > 0){
                        MongoClient.connect(dbUrl, function(err,db){
                        var myquery = {"username":username};
                        var newvalue = { $set:{"username":username,"password":newpwd}};
                        console.log("1")
                        dbo.collection("customer").updateOne(myquery,newvalue,function(err,res){
                            if(err)throw err;
                            console.log("1 document updated");
                        });
                            res.end("success");
                        });
                    }else{
                        res.end("fail");
                    }
                });
            });


        })
    }else{
        console.log("loading")
        sendFileContent(res, "changepassword.html", "text/html");
    }
}else if(req.url === "/favourite"){
    if(req.method == "POST"){
        console.log("favourite");
        return req.on('data' , function (data){
            formdata = '';
            formdata += data;
            //console.log(formdata);
            data = qs.parse(formdata);
            username = data['u_username'];
            console.log(username);
            MongoClient.connect(dbUrl , function(err,db){
                var dbo = db.db("shop");
                var userobj = {"username":username};
                dbo.collection("favouritelist").find(userobj).toArray(function(err,result){
                    if(err) throw err;
                    if(result.length>0){
                        var arraylist = [];
                        for(i=0;i<result.length;i++){
                            arraylist[i] = result[i]['favourite:','favouritevideo']
                        }
                        console.log(arraylist)
                        res.end(JSON.stringify([arraylist]));
                    }else{
                        res.end("fail");
                    }
                });
            });
        });
    }else{
        console.log("loading");
        sendFileContent(res, "favourite.html", "text/html");
    }
}
else if(req.url === "/index_logined"){
    if(req.method == "POST"){
        console.log("video page");
        return req.on('data' , function (data){
            formdata = '';
            formdata += data;
            //console.log(formdata);
            data = qs.parse(formdata);
            uname = data['u_name'];
            ufavourite = data['u_favourite'];
            console.log(uname+ufavourite);

            MongoClient.connect(dbUrl , function(err,db){
                var dbo = db.db("shop");
                var favouriteobject = {"username":uname,"favouritevideo":ufavourite};
                dbo.collection("favouritelist").find(favouriteobject).toArray(function(err, checkid){
                    console.log(checkid.length);
                    if (checkid.length>0){
                        res.end("fail_username_used")
                    }else{
                        dbo.collection("favouritelist").find({}).toArray(function(err, result){
                            if(err)throw err;
                            var user_id = result.length;
                            var userobj = {"username":uname,"favouritevideo":ufavourite};
                            dbo.collection("favouritelist").insertOne(userobj , function(err,res){
                                if(err) throw err;
                            });
                            res.end("success");
                        });
                    }
                })
            });
        });
        
    }else{
        console.log("loading");
        sendFileContent(res,"index_logined.html","text/html");
    }
        //sendFileContent(res, "index_logined.html", "text/html");
}else if(req.url === "/main"){
    if(req.method == "POST"){
        console.log("this is main page");
        return req.on('data' , function (data){
            formdata = '';
            formdata += data;
            //console.log(formdata);
            data = qs.parse(formdata);
            username = data['u_username'];
            password = data['u_password'];
            console.log(username+password);

            MongoClient.connect(dbUrl , function(err,db){
                var dbo = db.db("testdb");
                var userobj = {"Username":username,"Password":password};
                dbo.collection("table1").insertOne(userobj , function(err,res){
                    if(err) throw err;

                });
            });
            res.end("success");
        });
    }else{
        console.log("loading");
        sendFileContent(res, "index.html", "text/html");
    }
}else if(req.url === "/reg"){
    if(req.method == "POST"){
        console.log("this is register page");
        return req.on('data' , function (data){
            formdata = '';
            formdata += data;
            //console.log(formdata);
            data = qs.parse(formdata);
            username = data['u_username'];
            password = data['u_password'];
            console.log(username+password);

            MongoClient.connect(dbUrl , function(err,db){
                var dbo = db.db("shop");
                dbo.collection("customer").find({username}).toArray(function(err, checkusername){
                    if (checkusername.length>0){
                        res.end("fail_username_used")
                    }else{
                        dbo.collection("customer").find({}).toArray(function(err, result){
                            if(err)throw err;
                            var user_id = result.length;
                            var userobj = {"id": user_id,"username":username,"password":password};
                            dbo.collection("customer").insertOne(userobj , function(err,res){
                                if(err) throw err;
                            });
                            res.end("success");
                        });
                    }
                })
            });
        });
    }else{
        console.log("loading");
        sendFileContent(res, "register.html", "text/html");
    }
}else if(req.url === "/login"){
    if(req.method == "POST"){
        console.log("this is Login page");
        return req.on('data' , function (data){
            formdata = '';
            formdata += data;
            //console.log(formdata);
            data = qs.parse(formdata);
            username = data['u_username'];
            password = data['u_password'];
            console.log(username+password);

            MongoClient.connect(dbUrl , function(err,db){
                var dbo = db.db("shop");
                var userobj = {"username":username,"password":password};
                dbo.collection("customer").find(userobj).toArray(function(err,result){
                    if(err) throw err;
                    console.log(result);
                    if(result.length>0){
                        res.end("success");
                    }else{
                        res.end("fail");
                    }
                });
            });
        });
    }else{
        console.log("loading");
        sendFileContent(res, "login.html", "text/html");
    }
    
}else if(req.url == "/del"){
    if(req.method == "POST"){
        console.log("this is Delete page");
        return req.on('data' , function (data){
            formdata = '';
            formdata += data;
            //console.log(formdata);
            data = qs.parse(formdata);
            video = data['u_videoId'];
            console.log(video);

            MongoClient.connect(dbUrl , function(err,db){
                var dbo = db.db("shop");
                var userobj = {favouritevideo:video};
                dbo.collection("favouritelist").deleteOne(userobj,function(err,result){
                    if(err) throw err;
                    console.log("1 document deleted");
                    res.end("success");
                });
            });
        });
    }else{
        console.log("loading");
        sendFileContent(res, "favourite.html", "text/html");
    }
    
}




else if(/^\/[a-zA-Z0-9\/-/]*.js$/.test(req.url.toString())){
sendFileContent(res, req.url.toString().substring(1), "text/javascript");
}else if(/^\/[a-zA-Z0-9\/-/]*.bundle.min.js$/.test(req.url.toString())){
sendFileContent(res, req.url.toString().substring(1), "text/javascript");
}else if(/^\/[a-zA-Z0-9\/-/]*.css$/.test(req.url.toString())){
sendFileContent(res, req.url.toString().substring(1), "text/css");
}else if(/^\/[a-zA-Z0-9\/-]*.min.css$/.test(req.url.toString())){
sendFileContent(res, req.url.toString().substring(1), "text/css");
}else if(/^\/[a-zA-Z0-9\/-]*.jpg$/.test(req.url.toString())){
sendFileContent(res, req.url.toString().substring(1), "image/jpg");
}else if(/^\/[a-zA-Z0-9-._\/]*.min.js$/.test(req.url.toString())){
sendFileContent(res, req.url.toString().substring(1), "text/javascript");
}else if(/^\/[a-zA-Z0-9-]*.min.css.map$/.test(req.url.toString())){
sendFileContent(res, req.url.toString().substring(1), "text/map");
}else if(/^\/[a-zA-Z0-9\/-/]*.min.js.map$/.test(req.url.toString())){
sendFileContent(res, req.url.toString().substring(1), "text/map");
}else if(/^\/[a-zA-Z0-9\/-/]*.css.map$/.test(req.url.toString())){
sendFileContent(res, req.url.toString().substring(1), "text/map");
}else if(/^\/[a-zA-Z0-9\/-/]*.png$/.test(req.url.toString())){
sendFileContent(res, req.url.toString().substring(1), "image/png");
}else if(/^\/[a-zA-Z0-9\/-/]*.ico$/.test(req.url.toString())){
sendFileContent(res, req.url.toString().substring(1), "text/ico");
}else if(/^\/[a-zA-Z0-9\/-/?]*.ttf$/.test(req.url.toString())){
sendFileContent(res, req.url.toString().substring(1), "text/font");
}else if(/^\/[a-zA-Z0-9\/-/?]*.woff$/.test(req.url.toString())){
sendFileContent(res, req.url.toString().substring(1), "text/woff");
}else if(/^\/[a-zA-Z0-9\/-/?]*.woff2$/.test(req.url.toString())){
sendFileContent(res, req.url.toString().substring(1), "text/woff2");
}else{
console.log("Requested URL is: " + req.url);
res.end();
}
}).listen(8080); //the server object listens on port 8080


function sendFileContent(response, fileName, contentType){
fs.readFile(fileName, function(err, data){
if(err){
response.writeHead(404);
response.write("Not Found!");
}
else{
response.writeHead(200, {'Content-Type': contentType});
response.write(data);
}
response.end();
});
}