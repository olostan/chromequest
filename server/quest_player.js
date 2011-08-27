var quests = require("./quests.js");

exports.register = function (app) {
    app.get('/player/join-quest', function (req,res) {
        var nick = req.query.nick;
        if (!nick) return fail(res,"No nick");
        var qhash = req.query.q;
        var quest = quests.getQuest(qhash);
        if (!quest) return fail(res,"No quest");

        req.session.playerHash = quest.joinPlayer(nick);
        req.session.questHash = qhash;
        ok(res);

    });
    app.get('/player/quest-status', function (req,res) {
        var quest = quests.getQuest(req.session.questHash);
        var player = quest?quest.getPlayer(req.session.playerHash):null;

        if (!quest || (!player && !req.session.master)) return fail(res,"No quest joined");
        var filteredPlayers = [];
        quest.players.forEach(function(player) { filteredPlayers.push({name:player.nick, completed:player.completed.length})} )
        res.send({status: quest.status, players: filteredPlayers, tasks: quest.tasks.length});
    });
    app.get('/player/quest-tasks', function (req,res) {
        var quest = quests.getQuest(req.session.questHash);
        var player = quest?quest.getPlayer(req.session.playerHash):null;
        if (!quest || !player) return fail(res,"No quest joined");

        if (quest.status == 'new' || quest.status == 'opened') return fail(res,"Quest was not started");

        var filteredTasks = [];
        quest.tasks.forEach(function(task) { filteredTasks.push({hash: task.hash, descr: task.descr})} );
        res.send({tasks:filteredTasks});
    });
    app.get('/player/test-url', function (req,res) {
        var url = req.query.url;
        if (!url) return fail(res,"No url to test");
        var quest = quests.getQuest(req.session.questHash);
        var player = quest?quest.getPlayer(req.session.playerHash):null;
        if (!quest || !player) return fail(res,"No quest joined");

        if (quest.status != 'running') return fail(res,"Quest is not running");

        var completed;
        for(var taskNo in quest.tasks) {
            if (quest.tasks[taskNo].url == url) completed = taskNo;
        }
        if (completed) {
            if (player.completed.indexOf(completed)==-1)
                player.completed.push(completed);
            res.send({ok: true});
        } else {
            fail(res,"Trying to hack?!");
        }
    });
    app.get('/player/quit-quest', function (req,res) {
        var quest = quests.getQuest(req.session.questHash);
        var player = quest?quest.getPlayer(req.session.playerHash):null;
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

function fail(res, msg){
    res.send({ok:false,message:msg});
}