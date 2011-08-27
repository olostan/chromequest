var express =  require("express"),
    master   = require("./quest_master.js"),
    player   = require("./quest_player.js");

var app = express.createServer();

master.register(app);
player.register(app);

app.get('/', function(req, res){
    res.send('Hello World! Don\'t panic');
});

var port = 8080;
console.log("Started server at "+port)
app.listen(port);

