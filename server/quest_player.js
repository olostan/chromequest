var quests = require("./quests.js");

exports.register = function (app) {
    app.get('/player/join-quest', function (req,res) {
        var nick = req.query.nick;
        if (!nick) return fail(res,"No nick");
        var qhash = req.query.q;
        var quest = quests.getQuest(qhash);
        if (!quest) return fail(res,"No quest");
//        if (!quest.isOpen) return fail(res, "Quest not open yet.");

        req.session.playerHash = quest.joinPlayer(nick);
        req.session.questHash = qhash;
        var retVal = {ok:true};
        retVal['tasks'] = quest.tasks;
        console.log(retVal);
        res.send(retVal);

    });
    app.get('/player/quest-status', function (req,res) {
        var quest = quests.getQuest(req.session.questHash);
        var player = quest?quest.getPlayer(req.session.playerHash):undefined;

        if (!quest || (!player && !req.session.master)) return fail(res,"No quest joined");
        var filteredPlayers = [];
        quest.players.forEach(function(player) { filteredPlayers.push({name:player.nick, completed:player.completed.length})} )
        res.send({status: quest.status, players: filteredPlayers, tasks: quest.tasks.length});
    });
    app.get('/player/quest-tasks', function (req,res) {
        var quest = quests.getQuest(req.session.questHash);
        var player = quest?quest.getPlayer(req.session.playerHash):undefined;
        
        console.log("A");
        if (!quest || (!player && !req.session.master)) return fail(res,"No quest joined");

        console.log("B");
        if (!quest.isRunning())
            return fail(res,"Quest was not started");

        console.log("C");
        var filteredTasks = [];
        var completedByPlayer = player.getCompletedTasks();
        console.log("D");
        console.dir(completedByPlayer);
        quest.tasks.forEach(function(task) {
            filteredTasks.push({
                hash: task.hash, 
                descr: task.descr, 
                taskStatus:completedByPlayer[task.hash]?"completed":"active"
            });
        });
        
        console.dir(filteredTasks);
        
        res.send({tasks:filteredTasks});
    });
    
    app.get('/player/test-url', function (req,res) {
        var url = req.query.url;
        if (!url) return fail(res,"No url to test");
        var quest = quests.getQuest(req.session.questHash);
        var player = quest?quest.getPlayer(req.session.playerHash):undefined;
        if (!quest || !player) return fail(res,"No quest joined");

        if (!quest.isRunning() ) return fail(res,"Quest is not running");

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

function fail(res, msg){
    res.send({ok:false,message:msg});
}