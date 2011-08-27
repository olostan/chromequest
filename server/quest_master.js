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
    var master = req.param('master');
    if (!master){
        fail(res, "Please, specify the quest master of a quest.");
        return;
    }
    
    var quest = quests.addQuest(master);
    
    req.session.currentQuest = quest.hash;
    res.send({questhash:quest.hash});
}

function add(req, res){
    var quest =  quests.getQuest(req.session.currentQuest),
        task  = req.param('url'),
        descr = req.param('descr');

    /* TODO: descr is not used at the moment :( */
    if (!quest){
        fail(res, "A quest should be created before adding tasks");
        return;
    }
    if(!task){
        fail(res, "Please, specify the quest and the task for update");
        return;
    }
    
    if (!quest.isNew()){
        fail(res,"Too late to add tasks");
        return;
    }

    quest.addTask(task, descr);
    
    ok(res);        
}

function open(req, res){
    var quest = quests.getQuest(req.session.currentQuest);
    if (!quest){
        fail(res, "No such quest found");
        return;
    }
    if (!quest.isNew()){
        fail(res, "This quest already opened.");
        return;
    }
    
    if (quest.tasks.length <= 0){
        fail(res, "This quest has no tasks, add some before opening it.");
        return;
    }
    
    quest.open();
    ok(res);
}

function start(req, res){
    var quest = quests.getQuest(req.session.currentQuest);
    if (!quest){
        fail(res, "No such quest found");
        return;
    }
    if (!quest.isOpened()){
        fail(res, "Quest should be opened before starting it.");
        return;
    }
    
    quest.run();
	ok(res);
}

function finish(req, res){
    var quest = req.session.currentQuest;
    if (!quest){
        fail(res, "No such quest found");
        return;
    }
    if (!quest.isRunning()){
        fail(res, "Only a runnning quest can be closed.");
        return;
    }
    
    quest.finish();
    ok(res);
}

function ok(res){
    res.send({ok:true});
}

function fail(res, msg){
    res.send({ok:false,message:msg});
}