loadConfig();
var state = States.NONE;

var viewMap = {
    NONE: "views/default.html",
    CREATING: "views/master.html"
}
var iconMap = {
    NONE: "default.png"
}

function updateState(newState) {
    state = newState;
    chrome.browserAction.setIcon({"path": iconMap[state]});
}

function getView() {
    return chrome.extension.getURL(viewMap[state]);
}

function startMasterQuest(hash) {
    var quest = new MasterQuest(hash);
    this,masterQuest = quest;
}