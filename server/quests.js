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

exports.generateHash = generateHash;

exports.addQuest = function(master,name, descr) {
    var quest = {
        master: master,
        name: name,
        descr: descr,
        hash: generateHash(),
        status: "new",
        tasks: [],
    	players: [],
    	joinPlayer: function(name){
    	    var player = {
    	            nick:name,
    	            id:generateHash(),
    	            completed:[],
    	            getCompletedTasks: function(tasks){
    	                var retVal = {};
    	                for(var idx in this.completed){
    	                    retVal[tasks[this.completed[idx]].hash] = true;
    	                }
    	                return retVal;
    	            }
    	    };
    	    this.players.push(player);
    	    return player.id;
    	},
    	addTask: function(url, descr, type){
    	    var task = {"url":url,"descr":descr,"hash":getHash(url), type: type};
    	    this.tasks.push(task);
    	    return task;
    	},
    	getTaskIdx: function(url){
    	    for (var i = 0; i < tasks.length; i++){
    	        if (tasks[i].url == url)
    	            return i;
    	    }
    	    return -1;
    	},
    	getPlayer: function(id) {
            for (var pN in this.players)
                if (this.players[pN].id == id) return this.players[pN];
            return null;
        },
    	isRunning: function(){
    	    return this.status == "running";
    	},
    	isOpened: function(){
    	    return this.status == "opened"; 
    	},
    	isNew: function(){
    	    return this.status == "new";
    	},
    	isFinished: function(){
    	    return this.status == "finished";    	    
    	},
    	open: function(){
    	    this.status = "opened";
    	},
    	run: function(){
    	    this.status = "running";
    	},
    	finish: function(){
    	    this.status = "finished";
    	}
    };
    quests[quest.hash] = quest;
    return quest;
};

exports.getQuest = function(hash) {
    return quests[hash];
};
exports.getQuests = function() {
    var list = [];
    for(var h in quests) {
        list.push(quests[h]);
    }
    return list;
}
exports.purgeQuests = function() {
    quests = {};
}
exports.removeQuest = function(quest) {
    return delete quests[quest.hash];
}