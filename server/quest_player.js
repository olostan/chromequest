var quests = require("./quests.js");

exports.register = function (app) {
    app.get('/player/join-quest', function (req,res) {
        var nick = req.query.nick;
        if (!nick) return fail(res,"No nick");
        var qhash = req.query.q;
        var quest = quests.getQuest(qhash);
        if (!quest) return fail(res,"No quest");

        console.dir(req.session);
        
        quest.players.push(nick);
        ok(res);

    });
    app.get('/player/quest-status', function (req,res) {
        res.send({started: false});
    });
    app.get('/player/quest-tasks', function (req,res) {
        res.send({tasks:["hash1","hash2"]});
    });
    app.get('/player/test-url', function (req,res) {
        res.send({ok: true});
    });
    app.get('/player/quit-quest', function (req,res) {
        res.send({ok: true});
    });
}


function ok(res){
    res.send({ok:true});
}

function fail(res, msg){
    res.send({ok:false,message:msg});
}