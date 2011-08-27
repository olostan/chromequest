var quests = require("./quests.js");

exports.register = function (app) {
    app.get('/player/join-quest', function (req,res) {
        var nick = req.query.nick;
        if (!nick) return fail(res,"No nick");
        var qhash = req.query.q;
        var quest = quests.getQuest(qhash);
        if (!quest) return fail(res,"No quest");

        req.session.player = quest.joinPlayer(nick);
        req.session.quest = quest;
        ok(res);

    });
    app.get('/player/quest-status', function (req,res) {
        var quest = req.session.quest;
        if (!quest) return fail(res,"No quest joined");
        var filteredPlayers = [];
        quest.players.forEach(function(player) { filteredPlayers.push({name:player.name,completed:player.completed.length})} )
        res.send({status: quest.status, players: filteredPlayers, tasks: quest.tasks.length});
    });
    app.get('/player/quest-tasks', function (req,res) {
        var quest = req.session.quest;
        if (!quest) return fail(res,"No quest joined");
        res.send({tasks:quest.tasks});
    });
    app.get('/player/test-url', function (req,res) {
        // TODO:
        // - test the usl, update user progress
        // - show quest-wide progress
        
        
        res.send({ok: true});
    });
    app.get('/player/quit-quest', function (req,res) {
        var quest = req.session.quest;
        var player = req.session.player;
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