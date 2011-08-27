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
    if (!master)return fail(res, "Please, specify the quest master of a quest.");

    var quest = quests.addQuest(master);
    
    req.session.questHash = quest.hash;
    req.session.master = true;
    res.send({questhash:quest.hash});
}

function add(req, res){
    var quest =  quests.getQuest(req.session.questHash),
        url  = req.param('url'),
        descr = req.param('descr');

    /* TODO: descr is not used at the moment :( */
    
    if (!quest) return fail(res, "A quest should be created before adding tasks");
    if(!url || !descr) return fail(res, "Url and Description should not be empty");

    if (quest.status != "new") return fail(res,"Too late to add tasks");

    quest.addTask(url, descr);
    ok(res);        
}

function open(req, res){
    var quest = quests.getQuest(req.session.questHash);
    if (!quest) return fail(res, "Create quest first");

    if (quest.status != "new") return fail(res, "This quest already opened.");

    quest.status = "opened";
    ok(res);
}

function start(req, res){
    var quest = quests.getQuest(req.session.questHash);

    if (!quest) return fail(res, "No such quest found");

    if (quest.status != "opened") return fail(res, "Quest should be opened before starting it.");

    quest.status = "running";
	ok(res);
}

function finish(req, res){
    var quest = quests.getQuest(req.session.questHash);

    if (!quest) return fail(res, "No such quest found");

    if (quest.status != "running") return fail(res, "Only a runnning quest can be closed.");

    quest.status = "finished";
    ok(res);
}

function ok(res){
    res.send({ok:true});
}

function fail(res, msg){
    res.send({ok:false,message:msg});
}