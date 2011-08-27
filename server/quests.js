var quests = [];
var crypto = require('crypto');

function getHash(str) {
    var hasher = crypto.createHash('md5');
    hasher.update(str);
}

function generateQuestId() {
    return getHash(quests.length+" "+Date.now());
}

exports.addQuest = function(master) {
    var quest = {
        master: master,
        hash: generateQuestId(),
        tasks: []
    }
    quests.push(quest);
}