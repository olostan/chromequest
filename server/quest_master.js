var crypto = require('crypto');
var quests = require("./quests.js");

exports.register = function(app){
	app.get('/master/create-quest', create);
    app.get('/master/add-task', add);
    app.get('/master/open-quest', open);
    app.get('/master/start-quest', start);
    app.get('/master/finish-quest', finish);
}

function create(req, res){
    var master = req.param('master');
    if (!master){
        res.send({ok:false});
        return;
    }
    
    var quest = quests.addQuest(master);
    res.send({questhash:quest.hash});
    
}

function add(req, res){
    var quest = req.get('quest'),
        task  = req.get('task');
    if (!quest || !task){
        res.send({ok:false});
        return;
    }
    
    quests.addTask(quest, task);
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