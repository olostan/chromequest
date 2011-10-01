loadConfig();
var state = States.NONE;

var viewMap = {
    NONE: "views/default.html",
    CREATING: "views/master.html",
    CREATED: "views/master_adding.html",
    OPENED: "views/master_opened.html",
    STARTED: "views/master_opened.html",

    JOINED: "views/player_join.html",
    PLAYING: "views/player_started.html",


    RESULT: "views/quest_result.html"
}
var iconMap = {
    NONE: "default.png"
}

function updateState(newState) {
    state = newState;
    var path = iconMap[state];
    if (!path) path = "default.png";
    path = "icons/"+path;
    chrome.browserAction.setIcon({"path": path});
}

function getView() {
    return chrome.extension.getURL(viewMap[state]);
}

var masterQuest;

function startMasterQuest(hash) {
    var quest = new MasterQuest(hash);
    masterQuest = quest;
}
var quest;

function startQuest(tasks) {
    quest = new Quest(tasks);
    console.log(quest);
    quest.onStarted();
}
function stopQuest() {
    if (quest) quest.onStopped();
    quest = undefined;
}

function dataGridLocale() {
    return chrome.extension.getURL("_locales/"+chrome.i18n.getMessage("locPath")+"/datagrid.json")
}