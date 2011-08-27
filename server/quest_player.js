var quests = require("./quests.js");

exports.register = function (app) {
    app.get('/player/join-quest', function (req,res) {
        var qhash = req.query.q;
        var quest = quests.getQuest(qhash);
        if (!quest) {
            res.send({ok: false, message:"No quest!"});
            return;
        }
        var userid = 1111;
        quest.players.push(userid);
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