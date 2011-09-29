var crypto = require('crypto');
var quests = require("./quests.js");

exports.register = function(app){
	app.get('/master/create-quest', create);

    app.post('/master/add-task', add);
    app.get('/master/del-task', delTask);

    app.get('/master/open-quest', open);

    app.get('/master/quest-status', status);

    app.get('/master/start-quest', start);
    app.get('/master/finish-quest', finish);
    app.get('/master/delete-quest', deletequest);
    app.get("/master/quest-list", quest_list);
    app.get("/master/purge", purge);
}

function create(req, res){
    var master = req.param('master');
    if (!master)return fail(res, "Please, specify the quest master of a quest.");
    var name = req.param('name');
    if (!name)return fail(res, "Please, specify name of the quest to start.");

    var quest = quests.addQuest(master,name);
    
    req.session.questHash = quest.hash;
    req.session.master = true;
    res.send({ok: true, questhash:quest.hash});
}

function add(req, res){
    var quest = getMasterQuest(req,res);
    if (!quest) return;


    var url  = req.param('url'),
        descr = req.param('descr'),
        type = req.param('descr');


    if(!url || !descr) return fail(res, "Url and Description should not be empty");

    if (!quest.isNew()) return fail(res,"Too late to add tasks");

    var dublicate = false;
    quest.tasks.forEach(function(task) { dublicate|= task.url==url });
    if (dublicate) return fail(res,"Url already exists");

    quest.addTask(url, descr,type);
    ok(res);        
}


function delTask(req, res){
    var quest = getMasterQuest(req,res);
    if (!quest) return;

    var url  = req.param('url');

    if(!url ) return fail(res, "Url should not be empty");
    if (!quest.isNew()) return fail(res,"Too late to add tasks");

    var taskN = -1;
    for(var n in quest.tasks) {
        if (quest.tasks[n].url == url) taskN = n;
    }
    if (taskN == -1) return fail(res,"There is no task with this URL");

    quest.tasks.splice(taskN,1);
    ok(res);
}



function open(req, res){
    var quest = getMasterQuest(req,res);
    if (!quest) return;

    if (!quest.isNew()) return fail(res, "This quest already opened.");
    if (quest.tasks.length <= 0) return fail(res, "This quest has no tasks, add some before opening it.");

    quest.open();
    ok(res);
}

function start(req, res){
    if (!req.session.master) return fail(res,"You're not master");

    var quest = quests.getQuest(req.session.questHash);

    if (!quest) return fail(res, "No such quest found");

    if (!quest.isOpened()) return fail(res, "Quest should be opened before starting it.");

    quest.run();
	ok(res);
}

function finish(req, res){
    if (!req.session.master) return fail(res,"You're not master");
    var quest = quests.getQuest(req.session.questHash);
    if (!quest) return fail(res, "No such quest found");

    if (!quest.isRunning()) return fail(res, "Only a runnning quest can be closed.");

    quest.finish();
    ok(res);
}

function deletequest(req, res){
    if (!req.session.master) return fail(res,"You're not master");
    var quest = quests.getQuest(req.session.questHash);
    if (!quest) return fail(res, "No such quest found");

    if (!quest.isFinished()) return fail(res, "Only a finished quest can be deleted.");

    if (quests.removeQuest(quest)) {
        req.session.destroy();
        ok(res);
    } else return fail(res,"Can't remove quest")
}


function quest_list(req, res) {
    var list = [];
    quests.getQuests().forEach(function(quest) {
        // cheet: for debug aonly
        // TODO: push only needed properties
        list.push(quest)
    })
    res.send(list);
}
function purge(req, res) {
    quests.purgeQuests();
    res.send({ok: true});
}

function status(req, res){
    var quest = getMasterQuest(req,res);
    if (!quest) return;
    
    var filteredTasks = [];
    
    quest.tasks.forEach(function(task) { filteredTasks.push({url: task.url, descr: task.descr, type: task.type})} );
    
    res.send({ok: true, quest: {status: quest.status, tasks:filteredTasks }});
}

function getMasterQuest(req,res) {
    if (!req.session.questHash) return fail(res,"No quest started");
    var quest = quests.getQuest(req.session.questHash);
    if (!quest) return fail(res, "Quest was not found");
    if (!req.session.master) return fail(res,"You're not master");
    return quest;
}

function ok(res){
    res.send({ok:true});
}

function fail(res, msg){
    res.send({ok:false,message:msg});
    return false;
}