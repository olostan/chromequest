var quests = require("./quests");

exports.register = function(app) {

    app.get('/get-quests', function(req, res) {
        var list = [];
        quests.getQuests(function(q) {
           if (q.status == 'opened')
            list.push({hash: q.hash, name: q.name, descr: q.descr});
        });
        var result = {
            sEcho : 1,
            iTotalReconds: list.length,
            "aaData": list
        }
        res.send(result);
    });
    app.get("/quest-result", function(req,res){
        if (!req.session.questHash) return fail(res,"No quest started");
        var quest = quests.getQuest(req.session.questHash);
        if (!quest) return fail(res, "Quest was not found");
        var players = [];
        quest.players.forEach(function(player) {
                players.push({nick: player.nick, completed: player.completed.length})
            });
        res.send({ok: true, quest: {status: quest.status, players:players, totaltasks : quest.tasks.length }});
    });
}

function fail(res, msg){
    res.send({ok:false,message:msg});
    return false;
}
