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
        fail(res, "Please, specify the quest master of a quest.");
        return;
    }
    
    var quest = quests.addQuest(master);
    res.send({questhash:quest.hash});
    
}

function add(req, res){
    var hash = req.param('questhash'),
        task  = req.param('task');
    if (!quest || !task){
        fail(res, "Please, specify the quest and the task for update");
        return;
    }
    var quest = quests.getQuest(hash);
    if (!quest){
        fail(res, "No such quest found");
        return;
    }
    if (quest.status != "new"){
        fail(res,"Too late to add tasks");
        return;
    }
    
    quest.tasks.push(task);
    ok(res);        
}

function open(req, res){
    var hash = res.param('questhash');
    var quest = quests.getQuest(hash);
    if (!quest){
        fail(res, "No such quest found");
        return;
    }
    if (quest.status != "new"){
        fail(res, "This quest already opened.");
        return;
    }
    
    quest.status = "opened";
    ok(res);
}

function start(req, res){
    var hash = res.param('questhash');
    var quest = quests.getQuest(hash);
    if (!quest){
        fail(res, "No such quest found");
        return;
    }
    if (quest.status != "opened"){
        fail(res, "Quest should be opened before starting it.");
        return;
    }
    
    quest.status = "running";
	ok(res);
}

function finish(req, res){
    var hash = res.param('questhash');
    var quest = quests.getQuest(hash);
    if (!quest){
        fail(res, "No such quest found");
        return;
    }
    if (quest.status != "running"){
        fail(res, "Only a runnning quest can be closed.");
        return;
    }
    
    quest.status = "finished";
    ok(res);
}

function ok(res){
    res.send({ok:true});
}

function fail(res, msg){
    res.send({ok:false,message:msg});
}