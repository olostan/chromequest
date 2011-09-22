var express =  require("express"),
    master   = require("./quest_master.js"),
    player   = require("./quest_player.js"),
    public = require("./public.js");

var app = express.createServer();

app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ secret: "./wEr00l!#111" }));

master.register(app);
player.register(app);
public.register(app);

app.get('/', function(req, res){
    res.send('Hello World! Don\'t panic');
});

app.get("/test.html", function(req,res) {
   res.sendfile("test.html");
});

var port = 8080;
console.log("Started server at "+port)
app.listen(port);

