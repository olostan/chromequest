var quests = [];
var crypto = require('crypto');

function getHash(str) {
    var hasher = crypto.createHash('md5');
    hasher.update(str);
    return hasher.digest('base64');
}

function generateQuestId() {
    var d = new Date();
    return getHash(quests.length+(d.toString())+d.getMilliseconds());
}

exports.addQuest = function(master) {
    var quest = {
        master: master,
        hash: generateQuestId(),
        tasks: []
    }
    quests.push(quest);
    return quest;
}
exports.getQuest = function(hash) {
    for(var qn in quests) if (quest[qn].hash == hash) return quest[qn];
    return null;
}