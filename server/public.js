exports.register = function(app) {

    app.get('/get-quests', function(req, res) {
        console.log("getting list");
        var quests = [];
        for(var i =0;i<100;i++) {
            var id = (Math.random()*10000)|0;
            quests.push(["Quest "+id,id]);
        }
        var result = {
            sEcho : 1,
            iTotalReconds: quests.length,
            "aaData": quests
        }
        res.send(result);
    })
}
