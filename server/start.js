var express = require("express");

var app = express.createServer();

app.get('/', function(req, res){
    res.send('Hello World');
});

var crypto = require("crypto");

app.get('/next-hash', function(req, res) {
    var hasher = crypto.createHash("md5");
    var url = "http://google.com/";
    hasher.update(url);
    var hash = hasher.digest('base64');
    res.send({hash: hash});
});

var port = 8080;
console.log("Started server at "+port)
app.listen(port);
