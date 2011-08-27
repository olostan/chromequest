exports.register = function (app) {
    app.get('/player/join-quest', function (req,res) {
        var qhash = req.query.q;

        res.send({hash:qhash});
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