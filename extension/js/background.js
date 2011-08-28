window._state = States.NONE;
window.currentQuest = null;

chrome.browserAction.onClicked.addListener(function(tab) {
    refreshPopup();
});

window.setState = function(state){
    _state = state;
    refreshPopup();
}

window.newQuestHash = null;
window.newQuestStatus = "new";
window.currentQuestHash = undefined;

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