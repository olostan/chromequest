var quests = {};
var crypto = require('crypto');

function getHash(str) {
    var hasher = crypto.createHash('md5');
    hasher.update(str);
    return hasher.digest('hex');
}
exports.generateHash = function generateHash() {
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
    	    players.push(player);
    	    return player;
    	}
    }
    quests[quest.hash] = quest;
    return quest;
}

exports.getQuest = function(hash) {
    return quests[hash];
}

exports.addTask = function(hash, task){
    var quest = this.getQuest(hash);
    console.log(quest);
    if (!quest){
        return false;
    }
    
    quest.tasks.push(task);
    console.log(quest);
    return true;
}
