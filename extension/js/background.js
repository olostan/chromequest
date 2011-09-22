loadConfig();
var state = States.NONE;

var viewMap = {
    NONE: "views/default.html"
}
var iconMap = {
    NONE: "default.png"
}

function updateState(newState) {
    state = newState;
    chrome.browserAction.setIcon({"path": iconMap[state]});
}

function getView() {
    return viewMap[state];
}