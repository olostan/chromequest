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
        res.send({status: quest.status, players: quest.players});
    });
    app.get('/player/quest-tasks', function (req,res) {
        var quest = req.session.quest;
        if (!quest) return fail(res,"No quest joined");
        res.send({tasks:quest.tasks});
    });
    app.get('/player/test-url', function (req,res) {
        var url    = req.param('url'),
            quest  = req.session.quest,
            player = req.session.player;
        
        if (!player || !quest) {
            fail(res, "Join a quest before trying to complete tasks.")
            return;
        }
        if (quest.status != "running"){
            fail(res, "This quest is not active. Pick an active quest to join.");
            return;
        }
        
        var index = quest.getTaskIdx(url);
        if (index == -1){
            fail(res, "This task is not part of the quest. Keep trying or skip for the next task. Good luck!");
            return;
        }
        
        player.completed.push(index);
        
        // TODO:
        // - test the usl, update user progress
        // - show quest-wide progress
        
        res.send({ok: true});
    });
    app.get('/player/quit-quest', function (req,res) {
        var quest = req.session.quest;
        if (!quest) return fail(res,"No quest joined");
        res.send({ok: true});
    });
}


function ok(res){
    res.send({ok:true});
}

function fail(res, msg){
    res.send({ok:false,message:msg});
}