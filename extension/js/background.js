window._state = States.NONE;
window.currentQuest = null;

loadConfig();

chrome.browserAction.onClicked.addListener(function(tab) {
    refreshPopup();
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (tab.status != "complete" ||
        tab.url == "chrome://newtab/" ||
        !tasks) {
        return;
    }

    var hash = hex_md5(tab.url);
    var match;
    for (var i = 0; i < tasks.length; ++i){
        if (tasks[i].hash == hash){
            match = tasks[i];
            break;
        }
    }

    if (match){
        $.getJSON(service("/player/test-url")+"?url=" + tab.url, function(data){
            if (data.OK) alert("You've got it!");
            else alert("Don't even think about hacking me!");
        });
    }
});

window.setState = function(state){
    _state = state;
    refreshPopup();
}

window.newQuestHash = null;
window.newQuestStatus = "new";
window.currentQuestHash = undefined;

window.tasks = null;

window.refreshPopup = function(){
    var view = null;
    var icon = null;
    switch(_state)
    {
        case States.CREATED:
                view = "views/created.html";
                icon = "icons/created.png";
        break;
        case States.OPENED:
                view = "views/opened.html";
                icon = "icons/opened.png";
        break;
        case States.STARTED:
                view = "views/started.html";
                icon = "icons/started.png";
        break;
        case States.JOINED:
                view = "views/joined.html";
                icon = "icons/joined.png";
        break;
        default:
                view = "views/default.html";
                icon = "icons/default.png";

    }
    chrome.browserAction.setPopup({"popup": view});
    chrome.browserAction.setIcon({"path": icon});
}

function setIconForManage(str)
{
	chrome.browserAction.setIcon({"path": str});
}