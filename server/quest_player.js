var quests = require("./quests.js");
var Codes = require("../extension/js/codes.js");

exports.register = function (app) {
    app.get('/player/join-quest', function (req,res) {
        var nick = req.query.nick;
        if (!nick) return fail(res,"No nick");
        var qhash = req.query.q;
        var quest = quests.getQuest(qhash);
        if (!quest) return fail(res,"No quest", Codes.NoQuest);

        if (!quest.options.isopen) {
            if (!quest.isOpened()) return fail(res, "You can't join this quest");
        } else {
            console.log(quest.status);
            if (!quest.isOpened() && !quest.isRunning())
                return fail(res, "You can't join this quest");
        }

        req.session.playerHash = quest.joinPlayer(nick);
        req.session.questHash = qhash;
        return ok(res);
    });
    app.get("/player/quest-players", function(req,res) {
        var quest = quests.getQuest(req.session.questHash);
        if (!quest) return fail(res,"No quest joined", Codes.NoQuest);
        var list = [];
        quest.players.forEach(function(p) { list.push({nick: p.nick}) });
        res.send({ok:true,players: list, status: quest.status });
    });


    app.get('/player/quest-status', function (req,res) {
        var quest = quests.getQuest(req.session.questHash);
        var player = quest?quest.getPlayer(req.session.playerHash):undefined;

        if (!quest || (!player && !req.session.master)) return fail(res,"No quest joined", Codes.NoQuest);
        var filteredPlayers = [];
        quest.players.forEach(function(player) { filteredPlayers.push({name:player.nick, completed:player.completed.length})} )
        res.send({status: quest.status, players: filteredPlayers, tasks: quest.tasks.length});
    });
    app.get('/player/quest-tasks', function (req,res) {
        var quest = quests.getQuest(req.session.questHash);
        var player = quest?quest.getPlayer(req.session.playerHash):undefined;
        
        if (!quest || (!player && !req.session.master)) return fail(res,"No quest joined", Codes.NoQuest);

        if (!quest.isRunning())
            return fail(res,"Quest was not started",{status: quest.status});

        var filteredTasks = [];
        var completedByPlayer = player.getCompletedTasks(quest.tasks);
        quest.tasks.forEach(function(task) {
            filteredTasks.push({
                hash: task.hash, 
                descr: task.descr,
                type: task.type,
                taskStatus:completedByPlayer[task.hash]?"completed":"active"
            });
        });
        
        res.send({ok: true, tasks:filteredTasks});
    });
    
    app.get('/player/test-url', function (req,res) {
        var url = req.query.url;
        var hash = req.query.hash;
        if (!url || !hash) return fail(res,"No url and hash to test");
        var quest = quests.getQuest(req.session.questHash);
        var player = quest?quest.getPlayer(req.session.playerHash):undefined;
        if (!quest || !player) return fail(res,"No quest joined");

        if (!quest.isRunning() ) return fail(res,"Quest is not running");

        console.log("trying "+url+" hash:"+hash);

        var completed;
        for(var taskNo in quest.tasks) {
            if (quest.tasks[taskNo].hash == hash) completed = taskNo;
        }
        // check if we're really completed
        if (completed) {
            var task = quest.tasks[completed];
            var testUrl = url;
            var parts = require("url").parse(url);

            if (task.type == 'domain')
                testUrl = parts['host'];
            else if (task.type == "nopar")
                testUrl = parts['protocol']+"//"+parts['host']+(parts['port']||"")+parts['pathname']

            if (task.url != testUrl) {
                console.log("Trying to hack&! "+task.url+" != "+testUrl);
                return fail(res,"Trying to hack&! "+task.url+" != "+testUrl);
            }

            if (player.completed.indexOf(completed)==-1)
                player.completed.push(completed);
            res.send({ok: true});
        } else {
            fail(res,"No task with such hash");
        }
    });
    app.get('/player/quit-quest', function (req,res) {
        var quest = quests.getQuest(req.session.questHash);
        var player = quest?quest.getPlayer(req.session.playerHash):undefined;
        if (!quest || !player) return fail(res,"No quest joined");
        
        var playerIdx = quest.players.indexOf(player);
        if (playerIdx==-1) return fail(res,"Something bad happen");
        delete quest.players[playerIdx];
        req.session.destroy();
        res.send({ok: true});
    });
}


function ok(res){
    res.send({ok:true});
}

function fail(res, msg, obj){
    if (typeof obj == 'number') obj = { code: obj };
    if (!obj) obj = {};
    obj.ok = false;
    obj.message = msg;
    res.send(obj);
}