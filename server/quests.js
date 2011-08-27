var quests = {};
var crypto = require('crypto');

function getHash(str) {
    var hasher = crypto.createHash('md5');
    hasher.update(str);
    return hasher.digest('hex');
}
function generateHash() {
    var d = new Date();
    return getHash(quests.length+(d.toString())+d.getMilliseconds());
}

exports.generateHash = generateHash;

exports.addQuest = function(master) {
    var quest = {
        master: master,
        hash: generateHash(),
        status: "new",
        tasks: [],
    	players: [],
    	joinPlayer: function(name){
    	    var hashId = generateHash();
    	    var player = {nick:name,id:hashId,completed:[]};
    	    this.players.push(player);
    	    return player;
    	},
    	addTask: function(url, descr){
    	    var task = {"url":url,"descr":descr};
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
