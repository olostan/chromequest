var quests = [];
var crypto = require('crypto');

function getHash(str) {
    var hasher = crypto.createHash('md5');
    hasher.update(str);
    
}
function generateQuestId() {
    return "asdasd";
}

exports.CreateQuest = function(master) {
    var quest = {
        master: master,
        hash: generateQuestId(),
        tasks: []
    }
}