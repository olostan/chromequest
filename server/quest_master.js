var crypto = require('crypto');
var quests = require("./quests.js");

exports.register = function(app){
	app.get('/master/create-quest', create);
    app.post('/master/add-task', add);
    app.get('/master/open-quest', open);
    app.get('/master/start-quest', start);
    app.get('/master/finish-quest', finish);
}

function create(req, res){
    var quest = quests.addQuest("asdasd");
	res.send({questhash:quest.hash});
}

function add(req, res){
    var url = req.body.url;
    var descr = req.body.descr;
    console.log(url);
    if (!url && !descr){
        res.send({ok:false});
        return;
    }
	res.send({ok:true});
}

function open(req, res){
	res.send({ok:true});
}

function start(req, res){
	res.send({ok:true});
}

function finish(req, res){
	res.send({ok:true});
}