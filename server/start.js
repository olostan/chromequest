var express = require("express"),
    admin   = require("./admin.js");

var app = express.createServer();
var sjcl = require("../extension/lib/sjcl.js");
app.get('/', function(req, res){
    res.send('Hello World');
});

app.get('/next-hash', function(req, res) {
    res.send({hash: "asdasdasd"})
});

app.get('/admin/:action', admin.action);
app.get('/admin', admin.home);


console.dir(sjcl);
var port = 3000;
console.log("Started server at "+port)
app.listen(port);
