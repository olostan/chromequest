var express =  require("express"),
    master   = require("./quest_master.js"),
    player   = require("./quest_player.js");

var app = express.createServer();

master.register(app);
player.register(app);

app.get('/', function(req, res){
    res.send('Hello World');
});
var quest = {
    phases : [
        { url: "http://google.com.ua/" },
        { url: "https://github.com/" }
    ]
}

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

