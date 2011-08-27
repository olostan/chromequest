var quests = {};
var crypto = require('crypto');

function getHash(str) {
    var hasher = crypto.createHash('md5');
    hasher.update(str);
    return hasher.digest('hex');
}
exports.generateHash = generateHash = function() {
    var d = new Date();
    return getHash(quests.length+(d.toString())+d.getMilliseconds());
}

exports.addQuest = function(master) {
    var quest = {
        master: master,
        hash: generateHash(),
        status: "new",
        tasks: [],
    	players: [],
    	joinPlayer: function(name){
    	    var player = {nick:name,id:generateHash(),completed:[]};
    	    this.players.push(player);
    	    return player.id;
    	},
        addTask: function(url, descr) {
            var task = { url: url, descr: descr, hash: getHash(url) };
            this.tasks.push(task);
            return task;
        },
        getPlayer: function(id) {
            for (var pN in this.players)
                if (this.players[pN].id == id) return this.players[pN];
            return null;
        }
    }
    quests[quest.hash] = quest;
    return quest;
}

exports.getQuest = function(hash) {
    if (!hash) return null;
    return quests[hash];
}
